import {Activity, ChevronRight} from "lucide-react";
import React from "react";
import {themeConfig} from "../../../../../lib";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";
import {AgentEventTypeEnum} from "../../../../../api/entity/enums/AgentEventTypeEnum.ts";

interface StepsReportOpenMessageProps {
    index: number;
    setShowStepsReport: (isShow: boolean, index: number) => void;
    backGroundColor: string;
}

export const StepsReportOpenMessage: React.FC<StepsReportOpenMessageProps> = ({
    index,
    setShowStepsReport,
    backGroundColor,
}) => {
    const {getAssistantMessagesInMessageContainer} = useCurChatSessionMessagesStore();
    if (getAssistantMessagesInMessageContainer(index)
        .filter(assistantMessage => assistantMessage.eventType === AgentEventTypeEnum.STEP_START).length <= 0) return <></>;
    return (
        <div
            onClick={() => setShowStepsReport(true, index)}
            className={`group relative overflow-hidden bg-[${backGroundColor}]
             rounded-2xl hover:shadow-xl w-[70%]
             ${
                themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                    ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                    : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
            }
             hover:border-indigo-400 transition-all cursor-pointer p-4 flex items-center gap-4`}
        >
            <div
                className={`bg-indigo-50 p-3 rounded-xl text-indigo-600 
                group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                <Activity size={24}/>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{"详细步骤报告"}</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">
                    包含
                    {
                        getAssistantMessagesInMessageContainer(index)
                            .filter(assistantMessage => assistantMessage.eventType === AgentEventTypeEnum.STEP_START).length
                    } 个详细执行步骤
                </p>
            </div>
            <ChevronRight size={20}
                          className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"/>
        </div>
    );
}
