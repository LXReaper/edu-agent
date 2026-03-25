import React, {useEffect, useState} from "react";
import {motion} from "motion/react";
import {DashBoardHeader} from "../ui/header/dashBoardHeader.tsx";
import {AsideTransition, GlobalRouterPath, ValidStepMessageTypes} from "../../../constants";
import {CssVariableNames} from "../../../lib";
import {ChatContainer} from "../ui/chatContainer/chatContainer.tsx";
import {ChatReportContainer} from "../ui/chatContainer/chatReportContainer.tsx";
import {AutoAnimatedRobot} from "../ui/icons/autoAnimatedRobot.tsx";
import {AgentController} from "../../../api/AgentController.ts";
import type {AgentEventResponse} from "../../../api/entity/response/AgentEventResponse.ts";
import {AgentEventTypeEnum} from "../../../api/entity/enums/AgentEventTypeEnum.ts";
import {LLMProviderEnum} from "../../../api/entity/enums/LLMProviderEnum.ts";
import {useAlertMessage} from "../../../hooks/AlertContext.tsx";
import {LLMMessageRoleEnum} from "../../../api/entity/enums/LLMMessageRoleEnum.ts";
import type {ChatSessionMessage} from "../../../api/entity/models/ChatSessionMessage.ts";
import type {AgentEventResponseCoreContent} from "../../../api/entity/AgentEventResponseCoreContent.ts";
import {useCurChatSessionMessagesStore} from "../../store/useCurChatSessionMessagesStore.tsx";
import {useCurReportStepsInfoStore} from "../../store/useCurReportStepsInfoStore.tsx";
import {debounce} from "../../../utils/debounceThrottle.ts";
import {useAllChatSessionStore} from "../../store/useAllChatSessionStore.tsx";
import {useMatch} from "react-router-dom";
import type {ToolResult} from "../../../api/entity/ToolResult.ts";
import {ToolNameTypeEnum} from "../../../api/entity/enums/ToolNameTypeEnum.ts";
import type {SlideInfo} from "../../../api/entity/tools/SlideInfo.ts";
import {usePPTXInfo} from "../../store/usePPTXInfo.tsx";

interface MainDashBoardContainerProps {
    leftAsideIsExpand: boolean;
    setLeftAsideIsExpand: (leftAsideIsExpand: boolean) => void;

    setLoginModelIsOpen: (loginModelIsOpen: boolean) => void;

    showReport: boolean;
    setShowReport: (isShow: boolean) => void;
}

export const MainDashBoardContainer: React.FC<MainDashBoardContainerProps> = ({
    leftAsideIsExpand,
    setLeftAsideIsExpand,
    setLoginModelIsOpen,

    showReport,
    setShowReport,
}) => {
    const {showAlert} = useAlertMessage();

    const matchPath = useMatch(GlobalRouterPath.DASHBOARD_DETAIL);

    const [chatSessionId, setChatSessionId] = useState(matchPath?.params?.id ?? "");

    const [newMessage, setNewMessage] = useState<ChatSessionMessage>(null);

    const {selectCurSelectChatSessionId} = useAllChatSessionStore();
    const store = useCurChatSessionMessagesStore.getState?.();
    const curReportStepsInfoStore = useCurReportStepsInfoStore.getState?.();
    const {updatePPTXPreviewContainerIfEqualProjectId} = usePPTXInfo();

    const [reportTime, setReportTime] = useState<Date>(new Date());

    // chatContainer输入框中输入的内容
    const [inputValue, setInputValue] = useState("");

    const maxHeight = "90vh";

    useEffect(() => {
        const tempChatSessionId = matchPath?.params?.id ?? "";
        setChatSessionId(tempChatSessionId);
        store.clearMessageContainerList();
        if (tempChatSessionId) {// 选中这个chatSessionId
            const selectSuccess = selectCurSelectChatSessionId(tempChatSessionId);
            if (selectSuccess) {
                store.clearMessageContainerList();
                store.initMessageContainerList(tempChatSessionId);
            }
        }
    }, []);

    const setShowStepsReport = (isShow, index) => {
        store.setNewCurSelectMessageContainerIndex(index);
        const messages = store.getCurSelectAssistantMessagesInMessageContainer();
        if (messages && messages.length) {
            curReportStepsInfoStore.clearStepsContainer();
            for (const message of messages) {
                if (!message || !message.eventType || !ValidStepMessageTypes.includes(message.eventType)) continue ;
                curReportStepsInfoStore.stepsContainerUpdate(message.eventType, message);
            }
        }
        setShowReport(isShow);
    }
    const setShowStepsReportDebounce = debounce(setShowStepsReport, 300);

    // 在输入框中按下enter键触发的事件
    const enterLaunchEvent = async () => {
        const query = inputValue;
        setInputValue("");// 暂时清空文本框中的内容
        if (!query) return;

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
        }
        setNewMessage(userMessage);// 先设置用户消息
        store.addUserMessageInMessageContainerList(userMessage);// 初始化当前对话

        await AgentController.callLLM({
            query: query,
            provider: LLMProviderEnum.DEEP_SEEK,
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                            const assistantMessages = store.getAssistantMessagesInLastMessageContainer();
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
                                store.updateAssistantMessagesInLastMessageContainer(tempMessage);
                            }
                            break;
                        }
                        default: {
                            setNewMessage(tempMessage);
                            store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                            message: agentEventResponseCoreContent.stepProgressId,
                        } as AgentEventResponseCoreContent),
                        eventType: AgentEventTypeEnum.STEP_PROGRESS,
                        sequenceNumber: eventDate.getTime(),
                        chatSessionHistoryRootId: chatRootMessageId,
                        createTime: eventDate,
                        updateTime: eventDate
                    };
                    store.updateStepProgressMessageContentByStepProgressId(tempMessage);
                    setNewMessage(store.getLastStepProgressMessageInLastMessageContainer());
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
                    store.updateStepProgressMessageContentDoneState(agentEventResponseCoreContent.stepProgressId);
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
                    store.updateStepProgressMessageContentByStepProgressId(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
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
                    store.updateAssistantMessagesInLastMessageContainer(tempMessage);
                    break;
                }
            }
        })
    }

    return (
        <motion.main
            animate={{
                marginLeft: leftAsideIsExpand ? CssVariableNames.dashboardLeftAsideWidth : 0,
            }}
            transition={AsideTransition}
            initial={{ marginLeft: leftAsideIsExpand ? CssVariableNames.dashboardLeftAsideWidth : 0 }}
            className={`relative flex flex-col h-[100vh] bg-[${CssVariableNames.dashboardBackgroundColor}]`}
        >
            {/*header Of dashboard*/}
            <DashBoardHeader
                leftAsideIsExpand={leftAsideIsExpand}
                setLeftAsideIsExpand={setLeftAsideIsExpand}
                setLoginModelIsOpen={setLoginModelIsOpen}
            />
            <div className={`flex justify-center items-center w-[100vw]`}>
                <motion.div
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                    className={`flex-shrink-0`}
                >
                    <ChatContainer
                        setShowStepsReport={setShowStepsReportDebounce}
                        maxHeight={maxHeight}
                        inputValue={inputValue} setInputValue={setInputValue}
                        enterLaunchEvent={enterLaunchEvent}
                        newMessage={newMessage}
                    />
                </motion.div>

                {showReport && (
                    <ChatReportContainer
                        newMessage={newMessage}
                        maxHeight={maxHeight} setShowReport={setShowReport}
                        reportTime={reportTime}
                    />
                )}
            </div>
            {curReportStepsInfoStore.getStepsContainerLength() > 0 && !showReport &&
                <motion.div
                    initial={{
                        opacity: 0,
                        x: '15vw',
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: 0.1,
                            when: "beforeChildren",
                        }
                    }}
                    className={`absolute flex justify-center items-center text-[${CssVariableNames.dashboardForegroundColor}]
                        right-[3vw] bottom-[5vh] cursor-pointer`}
                    onClick={() => setShowReport(true)}
                >
                    <AutoAnimatedRobot
                        chatBubbleTop={`6vh`}
                        width={`5vw`}
                        height={`50vh`}
                        robotPhrases={[
                            "Hello! Nice to meet you!",
                            "Click me to view report!"
                    ]} />
                </motion.div>
            }
        </motion.main>
    )
}
