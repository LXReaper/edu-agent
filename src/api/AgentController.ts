import {fetchEventSource} from "@microsoft/fetch-event-source";
import {BACKEND_URL, BasicRequest} from "./BasicRequest.ts";
import type {ChatRequest} from "./entity/request/ChatRequest.ts";
import type {AgentEventResponse} from "./entity/response/AgentEventResponse.ts";
import {AgentEventTypeEnum} from "./entity/enums/AgentEventTypeEnum.ts";

const basicRequest = BasicRequest();
const agentPath = "/agents";
export class AgentController {
    // 使用 Map 存储每个调用的重试计数
    private static readonly MAX_RETRIES = 3;
    private static abortController: AbortController | null = null;

    public static createChatSession = async (
        chatRequest: ChatRequest
    ) => {
        try {
            const response = await basicRequest.post(agentPath + "/chat/session/create", chatRequest)
            return response.data.data;
        } catch (error) {
            console.error('请求创建聊天会话失败:', error);
            return [];
        }
    }

    public static callLLM = async (
        request: ChatRequest,
        onmessage: (agentEventResponse: AgentEventResponse) => void,
        onClose?: () => void,
        onError?: (err: any) => number | null | undefined | void
    ) => {
        if (this.abortController) {
            this.abortController.abort();
        }
        // 创建新的 AbortController
        const that = this as any;
        that.abortController = new AbortController();
        const url = `${BACKEND_URL}${agentPath}/chat`;

        try {
            await fetchEventSource(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
                signal: that.abortController.signal,

                // 连接成功建立时的回调
                async onopen(response) {
                    console.log('SSE连接已建立', response);
                    // 检查响应状态和类型
                    if (!response.ok) {
                        throw new Error(`HTTP错误: ${response.status}`);
                    }
                    const contentType = response.headers.get('content-type');
                    if (!contentType?.includes('text/event-stream')) {
                        throw new Error(`期望 text/event-stream，但收到: ${contentType}`);
                    }
                },

                // 每次收到消息时的回调
                onmessage(event) {
                    // console.log('收到原始消息:', event.data);
                    try {
                        // 处理 SSE 数据
                        if (event.data === '[DONE]') {
                            console.log('流式响应完成');
                            return;
                        }

                        // 解析 JSON 数据
                        const data = that.createAgentEventResponse(JSON.parse(event.data)) as AgentEventResponse;
                        // console.log('解析后的数据:', data);

                        onmessage(data);

                        // 如果是最后一条消息，可以自动关闭连接
                        if (data && data?.eventType === AgentEventTypeEnum.SUCCESS) {
                            console.log('检测到完成标记');
                            that.abortController?.abort();
                        }
                    } catch (e) {
                        // console.error('消息解析失败: ' + e + '，原始数据:', event.data);
                    }
                },

                // 关闭连接时的回调
                onclose() {
                    console.log('SSE连接已关闭');
                    that.abortController = null;
                    if (onClose) onClose();
                },
                // 错误处理
                onerror(err) {
                    if (onError) onError(err);
                    console.error('SSE错误:', err);
                    // 必须抛出错误才会停止重连，如果不抛出，库会自动重连
                    throw err;
                },

                // 重连配置（可选）
                openWhenHidden: true,  // 页面隐藏时保持连接
                retryInterval: 3000,   // 重连间隔（毫秒）
            });
        } catch (error) {
            console.error('SSE连接失败:', error);
            throw error;
        }

    }

    // 判断是否应该重试
    private static shouldRetry(error: any): boolean {
        // 网络错误应该重试
        if (error.name === 'TypeError' || error.message?.includes('network')) {
            return true;
        }
        // 5xx 服务器错误应该重试
        if (error.message?.includes('HTTP 5')) {
            return true;
        }
        // 429 限流应该重试
        if (error.message?.includes('HTTP 429')) {
            return true;
        }
        // 其他错误不重试
        return false;
    }
    private static createAgentEventResponse = (data: any): AgentEventResponse => {
        return {
            curChatSessionHistoryId: data.curChatSessionHistoryId,
            chatSessionHistoryRootId: data.chatSessionHistoryRootId,
            chatSessionId: data.chatSessionId,
            agentId: data.agentId,
            userId: data.userId,
            eventType: data.eventType,
            message: data.message,
            todoStep: data.todoStep,
            content: data.content,
            // 转换 eventDate：如果是字符串，转换为 Date 对象
            eventDate: data.eventDate ? new Date(data.eventDate) : new Date()
        };
    };
}
