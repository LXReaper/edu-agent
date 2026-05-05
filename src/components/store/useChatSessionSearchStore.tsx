import {create} from "zustand/index";
import type {ChatSessionConfig} from "../../api/entity/models/ChatSessionConfig.ts";
import {ChatSessionController} from "../../api/ChatSessionController.ts";
import type {ElasticSearchResponse} from "../../api/entity/response/ElasticSearchResponse.ts";

type State = {
    isOpenChatSessionSearchContainer: boolean;
    pageSize: number;
    chatSessionSearchInfoList: ChatSessionConfig[];
};

type Action = {
    isOpen: () => boolean;
    open: () => void;
    close: () => void;
    searchChatSessionInfoList: (keyword: string, page: number) => void;
    searchMoreChatSessionInfoList: (keyword: string, page: number) => void;
    getChatSessionSearchInfoList: () => ChatSessionConfig[];
    getChatSessionSearchInfoListLength: () => number;
    editChatSessionTitle: (sessionId: string, newTitle: string) => void;
    deleteChatSession: (sessionId: string) => void;
    clearChatSessionSearchInfo: () => void;
};
const searchPageSizeInitNum = 8;
export const useChatSessionSearchStore = create<State & Action>((setState, getState) => ({
    isOpenChatSessionSearchContainer: false,
    pageSize: searchPageSizeInitNum,
    chatSessionSearchInfoList: [] as ChatSessionConfig[],
    isOpen: () => {
        const state = getState();
        if (!state) return false;
        return state.isOpenChatSessionSearchContainer;
    },
    open: () => {
        setState((state) => ({
            ...state,
            isOpenChatSessionSearchContainer: true,
            pageSize: searchPageSizeInitNum,
            chatSessionSearchInfoList: [] as ChatSessionConfig[],
        }))
    },
    close: () => {
        setState((state) => ({
            ...state,
            isOpenChatSessionSearchContainer: false,
            pageSize: searchPageSizeInitNum,
            chatSessionSearchInfoList: [] as ChatSessionConfig[],
        }))
    },
    searchChatSessionInfoList: async (keyword: string, page: number) => {
        const state = getState();
        if (!state) return;
        const searchDataRes = await ChatSessionController.search(keyword, page, searchPageSizeInitNum) as ElasticSearchResponse<ChatSessionConfig>;
        const totalElements = searchDataRes.totalElements;
        const content = [...new Map(searchDataRes.content.map(item => [item.id, item])).values()];
        setState(state1 => ({
            ...state1,
            pageSize: totalElements <= 0 ? 0 : searchPageSizeInitNum,
            chatSessionSearchInfoList: content,
        }))
    },
    searchMoreChatSessionInfoList: async (keyword: string, page: number) => {
        const state = getState();
        if (!state || state.pageSize <= 0) return;
        const searchDataRes = await ChatSessionController.search(keyword, page, state.pageSize) as ElasticSearchResponse<ChatSessionConfig>;
        const totalElements = searchDataRes.totalElements;
        const content = [...new Map(searchDataRes.content.map(item => [item.id, item])).values()];
        setState(state1 => ({
            ...state1,
            pageSize: Math.min(state1.pageSize + searchPageSizeInitNum, totalElements ?? state1.pageSize + searchPageSizeInitNum),
            chatSessionSearchInfoList: content,
        }))
    },
    getChatSessionSearchInfoList: () => {
        const state = getState();
        if (!state) return [];
        return state.chatSessionSearchInfoList;
    },
    getChatSessionSearchInfoListLength: () => {
        const state = getState();
        if (!state || !state.chatSessionSearchInfoList) return 0;
        return state.chatSessionSearchInfoList.length;
    },
    editChatSessionTitle: async (sessionId: string, newTitle: string) => {
        setState(state => ({
            ...state,
            chatSessionSearchInfoList: state.chatSessionSearchInfoList.map(chatSessionSearchInfo => {
                if (chatSessionSearchInfo.id != sessionId) return chatSessionSearchInfo;
                return {
                    ...chatSessionSearchInfo,
                    title: newTitle,
                }
            })
        }));
        await ChatSessionController.updateChatSessionTitle(sessionId, newTitle);
    },
    deleteChatSession: async (sessionId: string) => {
        setState(state => ({
            ...state,
            chatSessionSearchInfoList: state.chatSessionSearchInfoList.filter(chatSessionSearchInfo => chatSessionSearchInfo.id != sessionId)
        }));
        await ChatSessionController.deleteSession(sessionId);
    },
    clearChatSessionSearchInfo: () => {
        setState(({
            isOpenChatSessionSearchContainer: false,
            pageSize: searchPageSizeInitNum,
            chatSessionSearchInfoList: [] as ChatSessionConfig[],
        }))
    }
}));
