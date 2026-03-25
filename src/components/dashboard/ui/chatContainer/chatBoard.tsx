import {UserChatMessage} from "./chatBoard/userChatMessage.tsx";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CssVariableNames} from "../../../../lib";
import {AssistantChatMessage} from "./chatBoard/assistantChatMessage.tsx";
import type {ChatSessionMessage} from "../../../../api/entity/models/ChatSessionMessage.ts";
import {LLMMessageRoleEnum} from "../../../../api/entity/enums/LLMMessageRoleEnum.ts";
import {useCurChatSessionMessagesStore} from "../../../store/useCurChatSessionMessagesStore.tsx";

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
    const {getMessageContainerListLength, getMessageContainerList} = useCurChatSessionMessagesStore();

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
            <div ref={logEndRef} className="h-10"/>
        </div>
    )
}
