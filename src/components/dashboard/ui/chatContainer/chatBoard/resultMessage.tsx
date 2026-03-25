import {themeConfig} from "../../../../../lib";
import {MdViewer} from "../../../../mdEditor/mdViewer.tsx";
import React from "react";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";

interface ResultMessageProps {
    backGroundColor: string;
    content: string;
}

export const ResultMessage: React.FC<ResultMessageProps> = ({
    backGroundColor,
    content,
}) => {
    const {getCurSelectAssistantMessagesInMessageContainer} = useCurChatSessionMessagesStore();

    return (
        <div className={`w-[100%] max-w-[100%] bg-[${backGroundColor}] flex flex-col gap-[5vh] p-5 rounded-[15px]
            ${
            themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
        } 
        `}>
            <div className={`min-w-0 break-words`}>
                <MdViewer content={content}/>
            </div>
        </div>
    )
}
