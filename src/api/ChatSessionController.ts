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
     * 删除会话
     * @param chatSessionId
     */
    public static deleteSession = async (chatSessionId: string) => {
        try {
            const formData = new FormData();
            formData.append('chatSessionId', chatSessionId);
            const response = await basicRequest.post(chatSessionPath + "/delete", formData);

            const res = response.data;
            if (res.code !== 0) {
                console.error("聊天会话" + chatSessionId + "删除失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('请求删除聊天会话' + chatSessionId + '失败:', error);
            throw error;
        }
    }

    /**
     * 更新当前聊天会话的标题
     * @param chatSessionId
     * @param newTitle
     */
    public static updateChatSessionTitle = async (chatSessionId: string, newTitle: string) => {
        try {
            const formData = new FormData();
            formData.append('chatSessionId', chatSessionId);
            formData.append('title', newTitle);
            const response = await basicRequest.post(chatSessionPath + "/title/edit", formData);

            const res = response.data;
            if (res.code !== 0) {
                console.error("聊天会话" + chatSessionId + "的标题更新失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('请求更新聊天会话' + chatSessionId + '的标题失败:', error);
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

    /**
     * 搜索聊天会话
     * @param keyword 搜索关键词（title或消息内容）
     * @param page 页码，从0开始
     * @param size 每页大小
     */
    public static search = async (keyword: string, page: number, size: number) => {
        try {
            const response = await basicRequest.get(chatSessionPath + "/search", {
                params: {
                    keyword: keyword,
                    page: page,
                    size: size,
                }
            } as any);

            const res = response.data;
            if (res.code !== 0) {
                console.error("聊天会话搜索失败");
                return null;
            }

            return res.data;
        } catch (error) {
            console.error('聊天会话搜索失败:', error);
            return null;
        }
    }
}
