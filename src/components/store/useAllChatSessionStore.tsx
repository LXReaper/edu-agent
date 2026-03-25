import {create} from "zustand";
import type {ChatSessionConfig} from "../../api/entity/models/ChatSessionConfig.ts";
import type {PageRequest} from "../../api/entity/request/PageRequest.ts";
import {ChatSessionController} from "../../api/ChatSessionController.ts";
import type {ChatSessionConfigPage} from "../../api/entity/models/ChatSessionConfigPage.ts";

// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    curSelectChatSessionId: string;// 当前选中的chatSessionId
    chatSessionInfoRequest: PageRequest;
    chatSessionInfoList: ChatSessionConfig[];
};

type Action = {
    selectCurSelectChatSessionId: (chatSessionId: string) => boolean;
    getCurSelectChatSessionId: () => string;
    queryChatSessionInfoList: () => void;
    getChatSessionInfoList: () => ChatSessionConfig[];
    clearChatSessionInfoList: () => void;
};

export const useAllChatSessionStore = create<State & Action>((setState, getState) => ({
    curSelectChatSessionId: "",
    chatSessionInfoRequest: {
        current: 1,
        pageSize: 25,
    },
    chatSessionInfoList: [],
    selectCurSelectChatSessionId: async (chatSessionId: string) => {
        const state = getState();
        if (!state) return false;
        const isContain = await ChatSessionController.isContainChatSession(chatSessionId);
        if (isContain) {
            setState(state1 => ({
                ...state1,
                curSelectChatSessionId: chatSessionId
            }));
            return true;
        }
        return false;
    },
    getCurSelectChatSessionId: () => {
        const state = getState();
        if (!state) return "";
        return state.curSelectChatSessionId;
    },
    queryChatSessionInfoList: async () => {
        const state = getState();
        if (!state) return;
        const chatSessionConfigPage = await ChatSessionController.pageChatSession(state.chatSessionInfoRequest) as ChatSessionConfigPage;
        setState(state1 => ({
            ...state1,
            chatSessionInfoList: chatSessionConfigPage?.records ?? [],
        }))
    },
    getChatSessionInfoList: () => {
        const state = getState();
        if (!state) return [];
        return state.chatSessionInfoList;
    },
    clearChatSessionInfoList: () =>{
        setState(({
            curSelectChatSessionId: "",
            chatSessionInfoRequest: {
                current: 1,
                pageSize: 25,
            },
            chatSessionInfoList: [],
        }))
    }
}));
