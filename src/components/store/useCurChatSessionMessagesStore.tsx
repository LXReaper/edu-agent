import {create} from 'zustand';
import type {MessageContainer} from "../../type";
import type {ChatSessionMessage} from "../../api/entity/models/ChatSessionMessage.ts";
import {AgentEventTypeEnum} from "../../api/entity/enums/AgentEventTypeEnum.ts";
import type {AgentEventResponseCoreContent} from "../../api/entity/AgentEventResponseCoreContent.ts";
import type {PageRequest} from "../../api/entity/request/PageRequest.ts";
import {ChatSessionController} from "../../api/ChatSessionController.ts";

// 当前聊天会话的消息存储
// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    curSelectMessageContainerIndex: number;

    messageContainerListPageRequest: PageRequest;
    isReceiveSuccess: boolean;// 数据是否准备完成
    messageContainerList: MessageContainer[];
};

type Action = {
    initMessageContainerList: (chatSessionId: string) => void;
    updateMessageContainerList: (updater: (prev: MessageContainer[]) => MessageContainer[]) => void;
    getMessageContainerList: () => MessageContainer[];
    getMessageContainerListLength: () => number;
    getMessageContainer: (index: number) => MessageContainer;
    getAssistantMessagesInLastMessageContainer: () => ChatSessionMessage[];

    setNewCurSelectMessageContainerIndex: (newIndex: number) => void;
    getCurSelectAssistantMessagesInMessageContainer: () => ChatSessionMessage[];

    getUserMessageInMessageContainer: (index: number) => ChatSessionMessage;
    getAssistantMessagesInMessageContainer: (index: number) => ChatSessionMessage[];

    // 目前用不上
    getLastStepProgressMessageInLastMessageContainer: () => ChatSessionMessage;
    updateLastStepProgressMessageContentInLastMessageContainer: (content: string) => void;

    // 必须在LastMessageContainer
    isContainStepProgressMessageWithStepProgressId: (stepProgressId: number) => boolean;
    updateStepProgressMessageContentByStepProgressId: (newMessage: ChatSessionMessage) => ChatSessionMessage;
    updateStepProgressMessageContentDoneState: (stepProgressId: number) => void;

    addUserMessageInMessageContainerList: (newUserMessage: ChatSessionMessage) => void;
    updateAssistantMessagesInLastMessageContainer: (assistantMessage: ChatSessionMessage) => void;
    clearMessageContainerList: () => void;
}

export const useCurChatSessionMessagesStore = create<State & Action>((setState, getState) => ({
    curSelectMessageContainerIndex: 0,
    messageContainerListPageRequest: {
        current: 1,
        pageSize: 25,
    },
    isReceiveSuccess: false,
    messageContainerList: [],
    initMessageContainerList: async (chatSessionId: string) => {
        const state = getState();
        if (!chatSessionId && state) state.clearMessageContainerList();
        const chatSessionConfigPage = await ChatSessionController.pageChatMessageContainer({
            ...state.messageContainerListPageRequest,
            chatSessionId: chatSessionId,
        });
        const newMessageContainerList = chatSessionConfigPage?.records ?? [];
        setState(state1 => ({
            ...state1,
            curSelectMessageContainerIndex: newMessageContainerList.length - 1,
            isReceiveSuccess: true,
            messageContainerList: newMessageContainerList
        }));
    },
    updateMessageContainerList: (updater) => setState(state => ({
        ...state,
        messageContainerList: updater(state.messageContainerList)
    })),
    getMessageContainerList: () => {
        const state = getState();
        if (!state) return [];
        return state.messageContainerList;
    },
    getMessageContainerListLength: () => {
        const state = getState();
        if (!state) return 0;
        return state.messageContainerList.length;
    },
    getMessageContainer: (index: number) => {
        const state = getState();
        if (!state) return {} as MessageContainer;
        return state.messageContainerList[index];
    },
    getAssistantMessagesInLastMessageContainer: () => {
        const state = getState();
        if (!state || state.messageContainerList.length <= 0) return [];
        return state.messageContainerList[state.messageContainerList.length - 1].assistantMessages;
    },

    setNewCurSelectMessageContainerIndex: (newIndex: number) => {
        setState(state => ({
            ...state,
            curSelectMessageContainerIndex: newIndex
        }))
    },
    getCurSelectAssistantMessagesInMessageContainer: () => {
        const state = getState();
        const index = state.curSelectMessageContainerIndex;
        if (!state || state.messageContainerList.length <= 0 || index < 0 || state.messageContainerList.length <= index) return [];
        return state.messageContainerList[index].assistantMessages;
    },

    getUserMessageInMessageContainer: (index: number) => {
        const state = getState();
        if (!state || state.messageContainerList.length <= 0 || index < 0 || state.messageContainerList.length <= index) return {} as ChatSessionMessage;
        return state.messageContainerList[index].userMessage;
    },
    getAssistantMessagesInMessageContainer: (index: number) => {
        const state = getState();
        if (!state || state.messageContainerList.length <= 0 || index < 0 || state.messageContainerList.length <= index) return [];
        return state.messageContainerList[index].assistantMessages;
    },

    getLastStepProgressMessageInLastMessageContainer: () => {
        const state = getState();
        if (!state || !state.messageContainerList || state.messageContainerList.length <= 0) return null;
        const lastMessageContainer = state.messageContainerList[state.messageContainerList.length - 1];
        const assistantMessages = lastMessageContainer.assistantMessages;
        for (let i = assistantMessages.length - 1; i >= 0; --i) {
            if (assistantMessages[i].eventType === AgentEventTypeEnum.STEP_PROGRESS) return assistantMessages[i];
        }
        return null;
    },
    updateLastStepProgressMessageContentInLastMessageContainer: (content: string) => {
        // 必须由AgentEventTypeEnum.STEP_PROGRESS事件触发
        setState(state => ({
            ...state,
            messageContainerList: state.messageContainerList.map((messageContainer, i) => {
                if (i !== state.messageContainerList.length - 1) return messageContainer;
                return messageContainer.assistantMessages.map(assistantMessage =>
                    assistantMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS ?
                        {
                            ...assistantMessage,  // 保留原有属性
                            content: (assistantMessage.content || "") + content  // 合并content
                        } : assistantMessage
                );
            })
        }));
    },

    isContainStepProgressMessageWithStepProgressId: (stepProgressId: number) => {
        const state = getState();
        if (!state) return false;
        const curSelectAssistantMessages = state.getCurSelectAssistantMessagesInMessageContainer();
        for (const curSelectAssistantMessage of curSelectAssistantMessages) {
            if (curSelectAssistantMessages.eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                const coreContent = JSON.parse(curSelectAssistantMessage.content) as AgentEventResponseCoreContent;
                if (coreContent.stepProgressId && coreContent.stepProgressId === stepProgressId) return true;
            }
        }
        return false;
    },
    updateStepProgressMessageContentByStepProgressId: (newMessage: ChatSessionMessage) => {
        const state = getState();
        if (!state);
        const curLastAssistantMessages = state.getAssistantMessagesInLastMessageContainer();

        const agentEventResponseCoreContent = JSON.parse(newMessage.content) as AgentEventResponseCoreContent;// 新消息内容
        const stepProgressId = agentEventResponseCoreContent.stepProgressId;
        for (let i = curLastAssistantMessages.length; i >= 0; --i) {
            if (curLastAssistantMessages[i].eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                const coreContent = JSON.parse(curLastAssistantMessages[i].content) as AgentEventResponseCoreContent;// 旧消息内容
                if (coreContent.stepProgressId && coreContent.stepProgressId === stepProgressId) {// 如果存在这个流式消息
                    setState(state => ({
                        ...state,
                        messageContainerList: state.messageContainerList.map((messageContainer, index1) =>
                            index1 === state.messageContainerList.length - 1 ?
                                {
                                    ...messageContainer,
                                    assistantMessages: messageContainer.assistantMessages.map((assistantMessage, index2) =>
                                        index2 === i ?
                                            {
                                                ...assistantMessage,
                                                eventType: newMessage.eventType,
                                                content: JSON.stringify({
                                                    ...agentEventResponseCoreContent,
                                                    message:
                                                        newMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS_DONE ? agentEventResponseCoreContent.message :
                                                            coreContent.message + agentEventResponseCoreContent.message// 核心是这里，在旧消息末尾合并上新消息（前提是消息还未发完）
                                                } as AgentEventResponseCoreContent)
                                            } : assistantMessage
                                    )
                                } : messageContainer
                        )
                    }));
                    return;
                }
            }
        }
        // 第一条Step_progress消息
        state.updateAssistantMessagesInLastMessageContainer(newMessage);
    },
    updateStepProgressMessageContentDoneState: (stepProgressId: number) => {
        const state = getState();
        if (!state) return;
        const curLastAssistantMessages = state.getAssistantMessagesInLastMessageContainer();

        for (let i = curLastAssistantMessages.length; i >= 0; --i) {
            if (curLastAssistantMessages[i].eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                const coreContent = JSON.parse(curLastAssistantMessages[i].content) as AgentEventResponseCoreContent;// 旧消息内容
                if (coreContent.stepProgressId && coreContent.stepProgressId === stepProgressId) {// 如果存在这个流式消息
                    setState(state => ({
                        ...state,
                        messageContainerList: state.messageContainerList.map((messageContainer, index1) =>
                            index1 === state.messageContainerList.length - 1 ?
                                {
                                    ...messageContainer,
                                    assistantMessages: messageContainer.assistantMessages.map((assistantMessage, index2) =>
                                        index2 === i ?
                                            {
                                                ...assistantMessage,
                                                eventType: AgentEventTypeEnum.STEP_PROGRESS_DONE,
                                            } : assistantMessage
                                    )
                                } : messageContainer
                        )
                    }));
                    break;
                }
            }
        }
    },

    addUserMessageInMessageContainerList: (newUserMessage: ChatSessionMessage) => {
        setState(state => ({
            ...state,
            messageContainerList: [...state.messageContainerList, {
                userMessage: newUserMessage,
                assistantMessages: [],
            } as MessageContainer]
        }));
    },
    updateAssistantMessagesInLastMessageContainer: (assistantMessage: ChatSessionMessage) => {
        setState(state => ({
            ...state,
            messageContainerList: state.messageContainerList.map((messageContainer, i) =>
                i === state.messageContainerList.length - 1 ?
                    {
                        ...messageContainer,
                        assistantMessages: [...messageContainer.assistantMessages, assistantMessage]
                    } : messageContainer
            )
        }));
    },
    clearMessageContainerList: () => setState(({
        curSelectMessageContainerIndex: 0,

        messageContainerListPageRequest: {
            current: 1,
            pageSize: 25,
        },
        isReceiveSuccess: false,
        messageContainerList: [],
    }))
}));

export const useIsButtonDisabled = () => {
    return useCurChatSessionMessagesStore((state) => {
        const list = state?.messageContainerList;
        if (!list || list.length === 0) return true;

        const lastAssistantMessages = list[list.length - 1].assistantMessages;
        const successCount = lastAssistantMessages.filter(
            msg => msg.eventType === AgentEventTypeEnum.SUCCESS
        ).length;

        return successCount <= 0;
    });
};
