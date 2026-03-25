import React from "react";
import {CssVariableNames, themeConfig} from "../../../../../lib";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";

interface UserChatMessageProps {
    index: number;// 当前聊天会话中的第几组消息
}
export const UserChatMessage: React.FC<UserChatMessageProps> = ({
    index,
}) => {
    const store = useCurChatSessionMessagesStore.getState?.();

    return (
        <div className={`w-[100%] max-w-[100%] flex flex-row-reverse`}>
            <div
                style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap'
                }}
                className={`flex flex-wrap px-5 py-3 rounded-[15px] max-w-[75%] bg-[${CssVariableNames.technologyButtonColor}]
                    ${
                        themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                            ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                            : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
                    } 
                `}>
                {store.getUserMessageInMessageContainer(index)?.content ?? ""}
            </div>
        </div>
    )
}
