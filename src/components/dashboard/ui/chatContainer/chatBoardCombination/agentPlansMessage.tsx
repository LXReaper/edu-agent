import React from "react";
import {MdViewer} from "../../../../mdEditor/mdViewer.tsx";
import {CssVariableNames, themeConfig} from "../../../../../lib";

interface AgentPlansMessageProps {
    backGroundColor: string;
    planContent: string;// agent输出的plan内容
    isFinishPlan: boolean;// agent是否完成plan内容的输出
}
export const AgentPlansMessage: React.FC<AgentPlansMessageProps> = ({
    backGroundColor,
    planContent,
    isFinishPlan,
}) => {
    return (
        <div className={`w-[100%] max-w-[100%] bg-[${backGroundColor}] flex flex-col gap-[5vh] p-5 rounded-[15px]
            ${
                themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                    ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                    : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
            } 
        `}>
            <MdViewer content={planContent} />
            {isFinishPlan &&
                <div className={`flex w-[100%] max-w-[100%] flex flex-row-reverse`}>
                    <div className={`flex gap-[1vw] select-none`}>
                        <div className={`rounded-[10px] flex justify-center items-center px-3 py-2 cursor-pointer
                            border border-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "#ddd" : "#888"}] 
                            bg-[${CssVariableNames.dashBoardNormalButtonColor}] hover:bg-[${CssVariableNames.dashBoardNormalButtonHoverColor}]`}>
                            Edit plan
                        </div>
                        <div className={`rounded-[10px] flex justify-center items-center px-3 py-2 cursor-pointer
                            bg-[${CssVariableNames.dashBoardOKButtonColor}] hover:bg-[${CssVariableNames.dashBoardOKButtonHoverColor}]
                            text-[${CssVariableNames.dashBoardOKButtonTextColor}]`}>
                            Start research
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
