import {BasicRequest} from "./BasicRequest.ts";
import type {PageRequest} from "./entity/request/PageRequest.ts";
import type {EdChatSessionConfigCreateRequest} from "./entity/request/EdChatSessionConfigCreateRequest.ts";
import type {ChatSessionMessagePageRequest} from "./entity/request/ChatSessionMessagePageRequest.ts";

const basicRequest = BasicRequest();
const chatSessionPath = "/chat/session";
export class ChatSessionController {

    /**
     * 创建一个聊天会话
     * @param createRequest
     */
    public static createSession = async (createRequest: EdChatSessionConfigCreateRequest) => {
        try {
            const response = await basicRequest.post(chatSessionPath + "/create", {
                body: createRequest,
            });

            const res = response.data;
            if (res.code !== 0) {
                console.error("聊天会话创建失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('请求创建一个聊天会话失败:', error);
            throw error;
        }
    }

    /**
     *
     * @param chatSessionId
     */
    public static isContainChatSession = async (chatSessionId: string) => {
        try {
            const formData = new FormData();
            formData.append('chatSessionId', chatSessionId);
            const response = await basicRequest.post(chatSessionPath + "/contain/judge", formData);

            const res = response.data;
            if (res.code !== 0) {
                console.error("获取会话存在判断失败");
                return false;
            }

            return res.data;
        } catch (error) {
            console.error('请求获取会话存在判断失败:', error);
            return false;
        }
    }

    /**
     * 获取到一部分聊天会话的分页信息
     * @param pageRequest
     */
    public static pageChatSession = async (pageRequest: PageRequest) => {
        try {
            const response = await basicRequest.post(chatSessionPath + "/page", pageRequest);

            const res = response.data;
            if (res.code !== 0) {
                console.error("一部分聊天会话的分页信息获取失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('请求获取一部分聊天会话的分页信息失败:', error);
            return null;
        }
    }

    /**
     * 获取当前聊天会话的消息列表
     * @param pageRequest
     */
    public static getChatSessionHistoryList = async (pageRequest: ChatSessionMessagePageRequest) => {
        try {
            const response = await basicRequest.post(chatSessionPath + "/messages/list", pageRequest);

            const res = response.data;
            if (res.code !== 0) {
                console.error("当前聊天会话的消息列表获取失败");
                return [];
            }

            return res.data;
        } catch (error) {
            console.error('请求获取当前聊天会话的消息列表失败:', error);
            return [];
        }
    }

    /**
     * 对多组消息的分页
     * @param pageRequest
     */
    public static pageChatMessageContainer = async (pageRequest: ChatSessionMessagePageRequest) => {
        try {
            const response = await basicRequest.post(chatSessionPath + "/messages/page", pageRequest);

            const res = response.data;
            if (res.code !== 0) {
                console.error("当前聊天会话的消息内容获取失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('请求获取当前聊天会话的消息内容失败:', error);
            return null;
        }
    }
}
