import React, {useState} from "react";
import {motion} from "motion/react";
import {CssVariableNames, themeConfig} from "../../../../lib";
import {MessageSquare, X} from "lucide-react";
import {ReportHeader} from "./chatReport/reportHeader.tsx";
import {StepFlowContainer} from "./chatReport/stepFlowContainer.tsx";
import type {ChatSessionMessage} from "../../../../api/entity/models/ChatSessionMessage.ts";

interface ChatReportContainerProps {
    newMessage: ChatSessionMessage;

    maxHeight: string;// 最大高度
    setShowReport: (showReport: boolean) => void;// 是否显示报告容器

    reportTime: Date;// 报告内容更新的时间
}
// 动画配置
const containerAnimation = {
    hidden: {
        opacity: 0,
        x: -150,
        scale: 0.05
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
            when: "beforeChildren",
            staggerChildren: 0.15
        }
    }
};

export const ChatReportContainer: React.FC<ChatReportContainerProps> = ({
    newMessage,

    maxHeight,
    setShowReport,

    reportTime,
}) => {
    const [cards, setCards] = useState([
        {
            id: "report_card",
            cardName: "Report",
            isActive: true,
        },
        {
            id: "activities_card",
            cardName: "Activities",
            isActive: false,
        },
    ]);

    const activeIndex = cards.findIndex(card => card.isActive);// 计算滑块位置
    const sliderWidth = 100 / cards.length; // 每个卡片的宽度百分比
    const handleCardClick = (clickedId: string) => {
        setCards(cards.map(card => ({
            ...card,
            isActive: card.id === clickedId
        })));
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerAnimation}
            className={`relative w-[45vw] bg-[${CssVariableNames.dashBoardTextBoardColor}] flex flex-col h-[${maxHeight}] max-h-[${maxHeight}]
                ${
                    themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                        ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                        : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
                } justify-center items-center gap-[5vh] p-5 rounded-[15px]`}>
            <div className={`px-1 py-1 rounded-[15px] flex w-[25%] relative
                 bg-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "#f1f3f0" : "#212832"}]`}>
                {/* 动画背景滑块 */}
                <motion.div
                    className={`absolute top-[3px] bottom-[3px] left-0 right-0 rounded-[15px] bg-[${CssVariableNames.dashBoardTextBoardColor}]`}
                    style={{
                        width: `${sliderWidth}%`,
                        zIndex: 0
                    }}
                    animate={{
                        x: `${activeIndex * 100}%`// 相当与向右移动自身width的${activeIndex * 100}%倍宽度
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                />
                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCardClick(card.id)}
                        className={`w-[${sliderWidth}%] flex justify-center items-center relative z-10 rounded-[15px] select-none cursor-pointer
                            py-1 px-5 relative
                            text-[${CssVariableNames.dashboardForegroundColor}]`}>
                        {card.cardName}
                    </motion.div>
                ))}
            </div>
            <div className={`absolute top-[1.25rem] right-[1.25rem] cursor-pointer flex justify-center items-center`} onClick={() => setShowReport(false)}>
                <X width={20} height={20} />
            </div>
            {/*核心模块*/}
            <div className={`h-[75vh] w-[100%] relative overflow-auto chat-report-container`}>
                <div className={`px-[5%]`}>
                    <ReportHeader  reportTime={reportTime}/>
                    {/*<StepsContainer />*/}
                    <StepFlowContainer newMessage={newMessage} />
                </div>

                {/* Floating Chat Button */}
                <button className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                    <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </motion.div>
    )
}
