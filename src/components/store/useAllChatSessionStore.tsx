import {create} from "zustand";
import type {ChatSessionConfig} from "../../api/entity/models/ChatSessionConfig.ts";
import type {PageRequest} from "../../api/entity/request/PageRequest.ts";
import {ChatSessionController} from "../../api/ChatSessionController.ts";
import type {ChatSessionConfigPage} from "../../api/entity/models/ChatSessionConfigPage.ts";
import {LLMMessageRoleEnum} from "../../api/entity/enums/LLMMessageRoleEnum.ts";
import type {ChatSessionMessage} from "../../api/entity/models/ChatSessionMessage.ts";
import {AgentController} from "../../api/AgentController.ts";
import {LLMProviderEnum} from "../../api/entity/enums/LLMProviderEnum.ts";
import type {AgentEventResponse} from "../../api/entity/response/AgentEventResponse.ts";
import {AgentEventTypeEnum} from "../../api/entity/enums/AgentEventTypeEnum.ts";
import type {AgentEventResponseCoreContent} from "../../api/entity/AgentEventResponseCoreContent.ts";
import type {ToolResult} from "../../api/entity/ToolResult.ts";
import {ToolNameTypeEnum} from "../../api/entity/enums/ToolNameTypeEnum.ts";
import type {SlideInfo} from "../../api/entity/tools/SlideInfo.ts";
import type {IAlertProps} from "../../type";
import {createJSONStorage, persist} from "zustand/middleware";

// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    curSelectChatSessionId: string;// 当前选中的chatSessionId
    chatSessionInfoRequest: PageRequest;
    chatSessionInfoList: ChatSessionConfig[];
};

type Action = {
    invokeAgent: (
        query: string, setInputValue: (newInputValue) => void,
        isButtonDisable: boolean, chatSessionId: string, provider: string,
        setNewMessage: (newMessage: ChatSessionMessage) => void,
        addUserMessageInMessageContainerList: (newUserMessage: ChatSessionMessage) => void,
        setChatSessionId: (chatSessionId: string) => void,
        setReportTime: (reportTime: Date) => void,
        updateAssistantMessagesInLastMessageContainer: (assistantMessage: ChatSessionMessage) => void,
        getAssistantMessagesInLastMessageContainer: () => ChatSessionMessage[],
        updatePPTXPreviewContainerIfEqualProjectId: (projectId: string) => void,
        updateStepProgressMessageContentByStepProgressId: (newMessage: ChatSessionMessage) => ChatSessionMessage,

        getLastStepProgressMessageInLastMessageContainer: () => ChatSessionMessage,
        showAlert: (alert: IAlertProps, time?: number) => void,
        updateStepProgressMessageContentDoneState: (stepProgressId: number) => void
    ) => void;

    selectCurSelectChatSessionId: (chatSessionId: string) => boolean;
    getCurSelectChatSessionId: () => string;
    queryChatSessionInfoList: () => void;
    getChatSessionInfoList: () => ChatSessionConfig[];
    clearChatSessionInfoList: () => void;
};

export const useAllChatSessionStore = create<State & Action>(
    persist(
        (setState, getState) => ({
            curSelectChatSessionId: "",
            chatSessionInfoRequest: {
                current: 1,
                pageSize: 25,
            },
            chatSessionInfoList: [],
            invokeAgent: async (
                query: string, setInputValue: (newInputValue) => void,
                isButtonDisable: boolean, chatSessionId: string, provider: string,
                setNewMessage: (newMessage: ChatSessionMessage) => void,
                addUserMessageInMessageContainerList: (newUserMessage: ChatSessionMessage) => void,
                setChatSessionId: (chatSessionId: string) => void,
                setReportTime: (reportTime: Date) => void,
                updateAssistantMessagesInLastMessageContainer: (assistantMessage: ChatSessionMessage) => void,
                getAssistantMessagesInLastMessageContainer: () => ChatSessionMessage[],
                updatePPTXPreviewContainerIfEqualProjectId: (projectId: string) => void,
                updateStepProgressMessageContentByStepProgressId: (newMessage: ChatSessionMessage) => ChatSessionMessage,

                getLastStepProgressMessageInLastMessageContainer: () => ChatSessionMessage,
                showAlert: (alert: IAlertProps, time?: number) => void,
                updateStepProgressMessageContentDoneState: (stepProgressId: number) => void
            ) => {
                const state = getState();
                if (!state || !query) return;
                setInputValue("");// 暂时清空文本框中的内容

                // todo userId和chatSessionId会保存在前端
                let userId = 1;
                const userMessage = {
                    id: -1,
                    sessionId: chatSessionId,
                    userId: userId,
                    messageRole: LLMMessageRoleEnum.USER,
                    content: query,
                    sequenceNumber: -1,
                    createTime: new Date(),
                    updateTime: new Date(),
                } as ChatSessionMessage;
                setNewMessage(userMessage);// 先设置用户消息
                addUserMessageInMessageContainerList(userMessage);// 初始化当前对话

                await AgentController.callLLM({
                    query: query,
                    provider: provider,
                    chatSessionId: chatSessionId,
                }, (agentEventResponse: AgentEventResponse) => {
                    const chatMessageId=  agentEventResponse.curChatSessionHistoryId;
                    const chatRootMessageId=  agentEventResponse.chatSessionHistoryRootId;
                    setChatSessionId(agentEventResponse.chatSessionId);
                    userId = agentEventResponse.userId;
                    const eventType = agentEventResponse.eventType;
                    const message = agentEventResponse.message;
                    const content = agentEventResponse.content;
                    const todoStep = agentEventResponse.todoStep;
                    const eventDate = agentEventResponse.eventDate;

                    let tempMessage = null;
                    setReportTime(eventDate);// 设置当前报告的时间
                    switch (eventType) {
                        case AgentEventTypeEnum.THINKING: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    content: todoStep ? JSON.stringify(todoStep) : null,
                                    message: message,
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break ;
                        }
                        case AgentEventTypeEnum.THINKING_DONE: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    content: todoStep ? JSON.stringify(todoStep) : null,
                                    message: message,
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break ;
                        }
                        case AgentEventTypeEnum.SKILLS_NEEDED: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: content,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break ;
                        }
                        case AgentEventTypeEnum.TASK_REASONING: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: content,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break ;
                        }
                        case AgentEventTypeEnum.TODO_STEP_GET: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: content,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.STEP_START: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    content: JSON.stringify(todoStep),
                                    message: message,
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.STEP_RESTART: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    content: JSON.stringify(todoStep),
                                    message: message,
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.TOOL_CALL: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.TOOL,
                                content: message,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.TOOL_RESULT: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.TOOL,
                                content: content,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };

                            const toolResult = JSON.parse(content) as ToolResult;
                            switch (toolResult.tool) {
                                case ToolNameTypeEnum.CREATE_RICH_PPT: {
                                    const slideInfo = JSON.parse(toolResult.data) as SlideInfo;
                                    const assistantMessages = getAssistantMessagesInLastMessageContainer();
                                    let isContainCurPPT = false;// 是否已经有同一个projectId的ppt信息
                                    for (let i = assistantMessages.length - 1; i >= 0; --i) {
                                        if (assistantMessages[i].eventType !== AgentEventTypeEnum.TOOL_RESULT) continue;
                                        const tempResult = JSON.parse(assistantMessages[i].content) as ToolResult;
                                        if (tempResult.tool !== ToolNameTypeEnum.CREATE_RICH_PPT) continue;
                                        const tempSlideInfo = JSON.parse(tempResult.data) as SlideInfo;
                                        if (tempSlideInfo.projectId === slideInfo.projectId) {
                                            isContainCurPPT = true;
                                            break;
                                        }
                                    }
                                    if (isContainCurPPT) {
                                        updatePPTXPreviewContainerIfEqualProjectId(slideInfo.projectId);
                                    } else {
                                        setNewMessage(tempMessage);
                                        updateAssistantMessagesInLastMessageContainer(tempMessage);
                                    }
                                    break;
                                }
                                default: {
                                    setNewMessage(tempMessage);
                                    updateAssistantMessagesInLastMessageContainer(tempMessage);
                                    break;
                                }

                            }
                            break;
                        }
                        case AgentEventTypeEnum.STEP_PROGRESS: {
                            const agentEventResponseCoreContent = JSON.parse(content) as AgentEventResponseCoreContent;
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    stepProgressId: agentEventResponseCoreContent.stepProgressId,
                                    content: JSON.stringify(todoStep),
                                    message: agentEventResponseCoreContent.message,
                                } as AgentEventResponseCoreContent),
                                eventType: AgentEventTypeEnum.STEP_PROGRESS,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            updateStepProgressMessageContentByStepProgressId(tempMessage);
                            setNewMessage(getLastStepProgressMessageInLastMessageContainer());
                            break;
                        }
                        case AgentEventTypeEnum.STEP_PROGRESS_ERROR: {
                            const agentEventResponseCoreContent = JSON.parse(content) as AgentEventResponseCoreContent;
                            showAlert({
                                message: agentEventResponseCoreContent.message,
                                type: "error",
                            }, 2000);
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    ...agentEventResponseCoreContent,
                                    content: JSON.stringify(todoStep),
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            if (agentEventResponseCoreContent.stepProgressId != null) {
                                updateStepProgressMessageContentDoneState(agentEventResponseCoreContent.stepProgressId);
                            }
                            break;
                        }
                        case AgentEventTypeEnum.STEP_PROGRESS_DONE: {
                            const agentEventResponseCoreContent = JSON.parse(content) as AgentEventResponseCoreContent;
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    stepProgressId: agentEventResponseCoreContent.stepProgressId,
                                    content: JSON.stringify(todoStep),
                                    message: agentEventResponseCoreContent.stepProgressId,
                                } as AgentEventResponseCoreContent),
                                eventType: AgentEventTypeEnum.STEP_PROGRESS_DONE,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            updateStepProgressMessageContentByStepProgressId(tempMessage);
                            setNewMessage(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.STEP_DONE: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: JSON.stringify({
                                    content: JSON.stringify(todoStep),
                                    message: message,
                                } as AgentEventResponseCoreContent),
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                        case AgentEventTypeEnum.SUCCESS: {
                            tempMessage = {
                                id: chatMessageId,
                                sessionId: chatSessionId,
                                userId: userId,
                                messageRole: LLMMessageRoleEnum.ASSISTANT,
                                content: content,
                                eventType: eventType,
                                sequenceNumber: eventDate.getTime(),
                                chatSessionHistoryRootId: chatRootMessageId,
                                createTime: eventDate,
                                updateTime: eventDate
                            };
                            setNewMessage(tempMessage);
                            updateAssistantMessagesInLastMessageContainer(tempMessage);
                            break;
                        }
                    }
                })
            },

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
        }),
        {
            name: 'all-chat-session-storage', // localStorage 中的 key 名称
            storage: createJSONStorage(() => localStorage), // 使用 localStorage，也可以换成 sessionStorage
            partialize: (state) => ({
                // 只持久化这些字段，排除不必要的运行时状态
                curSelectChatSessionId: state.curSelectChatSessionId,
                chatSessionInfoRequest: state.chatSessionInfoRequest,
                chatSessionInfoList: state.chatSessionInfoList,
            }),
            // 可选：版本控制，当数据结构变化时，可以清除旧数据
            version: 1,
            // 迁移函数，处理旧版本数据
            migrate: (persistedState, version) => {
                if (version === 0) {
                    // 处理数据迁移逻辑
                    return persistedState;
                }
                return persistedState;
            },
        }
    )
);

// 导出辅助函数，用于手动清除持久化数据
export const clearPersistedChatSessionStore = () => {
    localStorage.removeItem('all-chat-session-storage');
};

// 导出获取持久化数据的方法
export const getPersistedChatSessionState = () => {
    const persistedData = localStorage.getItem('all-chat-session-storage');
    if (persistedData) {
        try {
            return JSON.parse(persistedData);
        } catch (e) {
            console.error('Failed to parse persisted all chat session data', e);
            return null;
        }
    }
    return null;
};
