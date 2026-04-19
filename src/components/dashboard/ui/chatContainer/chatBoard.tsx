import {UserChatMessage} from "./chatBoard/userChatMessage.tsx";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CssVariableNames} from "../../../../lib";
import {AssistantChatMessage} from "./chatBoard/assistantChatMessage.tsx";
import type {ChatSessionMessage} from "../../../../api/entity/models/ChatSessionMessage.ts";
import {LLMMessageRoleEnum} from "../../../../api/entity/enums/LLMMessageRoleEnum.ts";
import {useCurChatSessionMessagesStore} from "../../../store/useCurChatSessionMessagesStore.tsx";
import {AgentEventTypeEnum} from "../../../../api/entity/enums/AgentEventTypeEnum.ts";

export interface ChatBoardRef {
    scrollToBottom: (behavior?: 'smooth' | 'auto') => void;
    getScrollHeight: () => number;
    isScrolledToBottom: () => boolean;
}
interface ChatBoardProps {
    setShowStepsReport: (isShow: boolean, index: number) => void;
    boardWidth: string;
    newMessage: ChatSessionMessage;
}
export const ChatBoard: forwardRef<ChatBoardRef, ChatBoardProps> = ({
    setShowStepsReport,
    boardWidth,
    newMessage,
}, ref) => {
    const [isStart, setIsStart] = useState(true);// 刚开始渲染

    const containerRef = useRef<HTMLDivElement>(null);
    const logEndRef = useRef<HTMLDivElement>(null);
    const {getMessageContainerListLength, getMessageContainerList, getAssistantMessagesInLastMessageContainer} = useCurChatSessionMessagesStore();

    // 滚动到底部的方法
    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        logEndRef.current?.scrollIntoView({ behavior: behavior });
    };
    // 获取滚动高度
    const getScrollHeight = () => {
        return containerRef.current?.scrollHeight || 0;
    };

    // 检查是否已经滚动到底部
    const isScrolledToBottom = () => {
        if (!containerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        return Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    };

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        scrollToBottom,
        getScrollHeight,
        isScrolledToBottom
    }));

    useEffect(() => {
        if (getMessageContainerListLength() && isStart) {
            setTimeout(() => {
                setIsStart(false);
                scrollToBottom();
            }, 300);// 加点延迟，以防一开始请求数据后没有触发
        }
    }, [getMessageContainerListLength]);

    useEffect(() => {
        if (newMessage) {
            scrollToBottom('smooth');
        }
    }, [newMessage]);
    const LoadingPulse = () => {
        const assistantMessages = getAssistantMessagesInLastMessageContainer();
        if (!assistantMessages || assistantMessages.length <= 0
            || assistantMessages[assistantMessages.length - 1].eventType === AgentEventTypeEnum.SUCCESS) return <></>;
        return (
            <div className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl rounded-tl-none w-fit transition-all animate-in fade-in slide-in-from-left-2">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-medium text-gray-300 dark:text-slate-500 ml-2 animate-pulse">
                    AI 正在思考...
                </span>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className={`relative max-w-[${boardWidth}] w-[${boardWidth}] px-1 pb-[2vh] gap-[5vh] flex flex-col overflow-y-scroll overscroll-contain hide-scrollbar`}>
            {getMessageContainerList().map((messageContainer, index) => {
                if (!messageContainer) return (<></>);
                return (
                    <div key={index} className={`flex flex-col gap-[5vh]`} id={`${index}`}>
                        {messageContainer.userMessage && <UserChatMessage index={index}/>}
                        {messageContainer.assistantMessages.length > 0 && <AssistantChatMessage
                            index={index}
                            backGroundColor={CssVariableNames.dashBoardTextBoardColor}
                            setShowStepsReport={setShowStepsReport}
                            newAssistantMessage={newMessage ?
                                (newMessage.messageRole === LLMMessageRoleEnum.ASSISTANT ? newMessage : null as ChatSessionMessage) : null as ChatSessionMessage}
                        />}
                    </div>
                )
            })}
            <LoadingPulse />
            <div ref={logEndRef} className="h-10"/>
        </div>
    )
}
