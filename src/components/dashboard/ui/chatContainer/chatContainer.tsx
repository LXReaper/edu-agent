import {CssVariableNames, themeConfig} from "../../../../lib";
import {Textarea} from "../../../home/ui/basic/Textarea.tsx";
import React, {useEffect, useRef} from "react";
import {motion} from "motion/react";
import {Paperclip, Send} from "lucide-react";
import {ChatBoard} from "./chatBoard.tsx";
import type {ChatSessionMessage} from "../../../../api/entity/models/ChatSessionMessage.ts";
import {useCurChatSessionMessagesStore, useIsButtonDisabled} from "../../../store/useCurChatSessionMessagesStore.tsx";
import {AgentEventTypeEnum} from "../../../../api/entity/enums/AgentEventTypeEnum.ts";

interface ChatContainerProps {
    setShowStepsReport: (isShow: boolean, index: number) => void;

    maxHeight: string;// 最大高度

    inputValue: string;// 输入框中的内容
    setInputValue: (newInputValue: string) => void;// 修改输入框内容的函数

    enterLaunchEvent: () => void;// 在输入框中按下enter键触发的事件

    newMessage: ChatSessionMessage;
}
export const ChatContainer: React.FC<ChatContainerProps> = ({
    setShowStepsReport,

    maxHeight,

    inputValue,
    setInputValue,

    enterLaunchEvent,

    newMessage,
}) => {
    // const chatBoardRef = useRef<ChatBoardRef>(null);
    const chatContainerWidth = '38vw';

    const textareaRef = useRef(null);
    const filesInputRef = useRef<HTMLInputElement>(null);

    const chatTitle = "Hello! My Master";

    const {getMessageContainerListLength} = useCurChatSessionMessagesStore();

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    return (
        <div className={`relative flex flex-col items-center justify-center justify-between h-[${maxHeight}] max-h-[${maxHeight}]`}>
            {getMessageContainerListLength() > 0 &&
                <div className={`flex justify-center text-[${CssVariableNames.foregroundColor}] gap-[8vw] h-[74.5vh] max-h-[74.5vh] px-[5vw] overflow-none`}>
                    <ChatBoard setShowStepsReport={setShowStepsReport} boardWidth={chatContainerWidth} newMessage={newMessage} />
            </div>}
            {getMessageContainerListLength() <= 0 &&
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    transition={{
                        opacity: { duration: 0.3 },
                        scale: { type: "spring", damping: 10 }
                    }}
                    className={`absolute w-[${chatContainerWidth}] md:top-[25vh] max-md:top-[20vh] flex items-center justify-center`}>
                    <h1 className={`text-[25pt] select-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500`}>
                        {chatTitle}
                    </h1>
            </motion.div>}
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                }}
                className={`absolute ${getMessageContainerListLength() > 0 ? "bottom-[3vh]" : "top-[35vh]"} flex flex-col 
                    md:w-[${chatContainerWidth}]
                    px-2 rounded-[15px] bg-[${CssVariableNames.dashBoardTextBoardColor}] text-[${CssVariableNames.foregroundColor}]
                    border border-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "#eee" : "#333"}] bg-[#fdf9f1]
                    ${
                        themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                            ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                            : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
                }`}>
                <div className={`text-[${CssVariableNames.dashboardForegroundColor}]`}>
                    <div></div>
                    <Textarea
                        ref={textareaRef}
                        className={`resize-none bg-[${CssVariableNames.dashBoardTextBoardColor}] min-h-[60px] max-h-[20vh]`}
                        placeholder={`What Can I do for you?`}
                        value={inputValue}
                        setInputValue={setInputValue}
                        enterLaunchEvent={enterLaunchEvent}
                        onChange={(event) => {
                            adjustTextareaHeight();
                            setInputValue(event.target.value);
                        }}
                        onWheel={(e) => e.nativeEvent.stopImmediatePropagation()}
                    />
                    <div className={`flex p-3 justify-between flex-1`}>
                        <div>
                            <Paperclip onClick={() => {
                                const filesInput = filesInputRef.current;
                                if (!filesInput) return;
                                filesInput.click();
                            }} className={`cursor-pointer`} height={20} width={20}/>
                            <input ref={filesInputRef} className={`hidden`} type={`file`} multiple/>
                        </div>
                        <button
                            onClick={enterLaunchEvent}
                            disabled={useIsButtonDisabled()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all shadow-md"
                        >
                            <Send size={18}/>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
