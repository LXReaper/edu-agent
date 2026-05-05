import React, {useEffect, useState} from "react";
import {motion} from "motion/react";
import {DashBoardHeader} from "../ui/header/dashBoardHeader.tsx";
import {AsideTransition, GlobalRouterPath, siteConfig, ValidStepMessageTypes} from "../../../constants";
import {CssVariableNames, themeConfig} from "../../../lib";
import {ChatContainer} from "../ui/chatContainer/chatContainer.tsx";
import {ChatReportContainer} from "../ui/chatContainer/chatReportContainer.tsx";
import {AutoAnimatedRobot} from "../ui/icons/autoAnimatedRobot.tsx";
import {useAlertMessage} from "../../../hooks/AlertContext.tsx";
import type {ChatSessionMessage} from "../../../api/entity/models/ChatSessionMessage.ts";
import {useCurChatSessionMessagesStore, useIsButtonDisabled} from "../../store/useCurChatSessionMessagesStore.tsx";
import {useCurReportStepsInfoStore} from "../../store/useCurReportStepsInfoStore.tsx";
import {debounce} from "../../../utils/debounceThrottle.ts";
import {useAllChatSessionStore} from "../../store/useAllChatSessionStore.tsx";
import {useMatch, useNavigate} from "react-router-dom";
import {AgentController} from "../../../api/AgentController.ts";
import {LLMProviderEnum} from "../../../api/entity/enums/LLMProviderEnum.ts";
import {usePPTXInfo} from "../../store/usePPTXInfo.tsx";
import {Edit, PanelLeftOpen, Search} from "lucide-react";
import {useChatSessionSearchStore} from "../../store/useChatSessionSearchStore.tsx";

interface MainDashBoardContainerProps {
    leftAsideIsExpand: boolean;
    setLeftAsideIsExpand: (leftAsideIsExpand: boolean) => void;

    setLoginModelIsOpen: (loginModelIsOpen: boolean) => void;

    showReport: boolean;
    setShowReport: (isShow: boolean) => void;
}

const RESTORE_INVOKE_KEY = "restore-invoke-agent";
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
    const [restoreInvokeAgent, setRestoreInvokeAgent] = useState(false);

    const [newMessage, setNewMessage] = useState<ChatSessionMessage>(null);

    const {selectCurSelectChatSessionId, invokeAgent} = useAllChatSessionStore();
    const {
        clearMessageContainerList, initMessageContainerList,
        setNewCurSelectMessageContainerIndex, getCurSelectAssistantMessagesInMessageContainer,
        getCurChatInputText, inputChatText, addUserMessageInMessageContainerList,
        updateAssistantMessagesInLastMessageContainer, getAssistantMessagesInLastMessageContainer,
        updateStepProgressMessageContentByStepProgressId,
        getLastStepProgressMessageInLastMessageContainer, updateStepProgressMessageContentDoneState
    } = useCurChatSessionMessagesStore();
    const curReportStepsInfoStore = useCurReportStepsInfoStore.getState?.();
    const {updatePPTXPreviewContainerIfEqualProjectId} = usePPTXInfo();
    const chatSessionSearchStore = useChatSessionSearchStore();

    const [reportTime, setReportTime] = useState<Date>(new Date());
    const navigate = useNavigate();

    const maxHeight = "90vh";

    useEffect(() => {
        const tempChatSessionId = matchPath?.params?.id ?? "";
        setChatSessionId(tempChatSessionId);
        clearMessageContainerList();
        if (tempChatSessionId) {// 选中这个chatSessionId
            const selectSuccess = selectCurSelectChatSessionId(tempChatSessionId);
            if (selectSuccess) {
                clearMessageContainerList();
                initMessageContainerList(tempChatSessionId);
            }
        }

        setTimeout(() => {
            // 如果之前调用enterLaunchEvent函数没有结束，这里可以续上
            const restoreInvokeValue = localStorage.getItem(RESTORE_INVOKE_KEY);
            if (restoreInvokeValue) enterLaunchEvent();
        }, 200);
    }, []);

    const setShowStepsReport = (isShow, index) => {
        setNewCurSelectMessageContainerIndex(index);
        const messages = getCurSelectAssistantMessagesInMessageContainer();
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
    const isButtonDisable = useIsButtonDisabled();

    // 在输入框中按下enter键触发的事件
    const enterLaunchEvent = async () => {
        let query = getCurChatInputText(), provider = LLMProviderEnum.DEEP_SEEK, chatId = chatSessionId;
        if (!chatSessionId) {
            const newChatSessionId = await AgentController.createChatSession({
                query: query,
                provider: provider,
                chatSessionId: chatId,
            });
            localStorage.setItem(RESTORE_INVOKE_KEY, JSON.stringify({
                query: query,
                provider: provider,
                chatSessionId: newChatSessionId,
            }));
            window.open(GlobalRouterPath.DASHBOARD + "/" + newChatSessionId, "_self");
            return;
        }
        const restoreInvokeValue = localStorage.getItem(RESTORE_INVOKE_KEY);
        if (restoreInvokeValue) {
            const invokeData = JSON.parse(restoreInvokeValue);
            query = invokeData.query;
            provider = invokeData.provider;
            chatId = invokeData.chatSessionId;
        }
        localStorage.removeItem(RESTORE_INVOKE_KEY);
        invokeAgent(
            query, inputChatText,
            isButtonDisable, chatId, provider,
            setNewMessage,
            addUserMessageInMessageContainerList,
            (newChatSessionId: string) => {
                setChatSessionId(newChatSessionId);
            },
            setReportTime,
            updateAssistantMessagesInLastMessageContainer,
            getAssistantMessagesInLastMessageContainer,
            updatePPTXPreviewContainerIfEqualProjectId,
            updateStepProgressMessageContentByStepProgressId,

            getLastStepProgressMessageInLastMessageContainer,
            showAlert,
            updateStepProgressMessageContentDoneState
        );
    }

    const navigateTo = (url: string, target = "_blank") => {
        window.open(url, target);
    };

    return (
        <motion.main
            animate={{
                marginLeft: leftAsideIsExpand ? CssVariableNames.dashboardLeftAsideWidth : 0,
            }}
            transition={AsideTransition}
            initial={{ marginLeft: leftAsideIsExpand ? CssVariableNames.dashboardLeftAsideWidth : 0 }}
            className={`relative flex flex-col h-[100vh] bg-[${CssVariableNames.dashboardBackgroundColor}]`}
        >
            {/*left column of header*/}
            {!leftAsideIsExpand &&
                <div className={`absolute left-0 top-0 h-[100vh] p-1 bg-[${CssVariableNames.dashboardBackgroundColor}]
                    border-r-2 border-r-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "#ddd" : "#888"}]`}>
                    <div className={`flex flex-col gap-[2vh]`}>
                        <div className={`flex cursor-pointer items-center justify-center rounded-[5px] p-1`}
                             onClick={() => navigate(GlobalRouterPath.HOME)}>
                            <img className={`cursor-pointer`} height={30} width={30} src={siteConfig.logo}/>
                        </div>
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-[5px] p-1 hover:bg-[#25262c]/[0.5] text-[${CssVariableNames.leftAsideForegroundColor}]`}
                            onClick={() => setLeftAsideIsExpand(!leftAsideIsExpand)}>
                            <PanelLeftOpen/>
                        </div>
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-[5px] p-1 hover:bg-[#25262c]/[0.5] text-[${CssVariableNames.leftAsideForegroundColor}]`}
                            onClick={() => chatSessionSearchStore.open()}>
                            <Search/>
                        </div>
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-[5px] p-1 hover:bg-[#25262c]/[0.5] text-[${CssVariableNames.leftAsideForegroundColor}]`}
                            onClick={() => navigateTo(GlobalRouterPath.DASHBOARD, "_self")}>
                            <Edit />
                        </div>
                    </div>
                </div>
            }
            {/*header Of dashboard*/}
            <DashBoardHeader
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
            {curReportStepsInfoStore.getAgentsStepsContainerLength() > 0 && !showReport &&
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
