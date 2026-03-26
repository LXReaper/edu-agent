import {Clock, Loader2} from "lucide-react";
import React from "react";
import moment from "moment";
import {ChatReportExeState} from "../../../../../type";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";
import {AgentEventTypeEnum} from "../../../../../api/entity/enums/AgentEventTypeEnum.ts";

interface ReportHeaderProps {
    reportTime: Date;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
    reportTime,
}) => {
    const {getCurSelectAssistantMessagesInMessageContainer} = useCurChatSessionMessagesStore();

    return (
        <div className={``}>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Agent 任务执行报告</h1>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4"/>
                        {moment(reportTime).format("YYYY/MM/DD HH:mm")}
                    </span>
                    {(() => {
                        const assistantMessages = getCurSelectAssistantMessagesInMessageContainer();
                        const stepDoneCount = assistantMessages.filter(assistantMessage => assistantMessage.eventType === AgentEventTypeEnum.SUCCESS).length;
                        if (stepDoneCount > 0)
                            return (<span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">执行完成</span>);
                        else return (
                            <span
                                className="px-2 flex justify=center items-center gap-2 py-0.5 text-gray-700 rounded text-xs font-semibold">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500"/>
                                执行中...
                            </span>
                        );
                    })()}

                </div>
            </header>
            {/* Task Objective */}
            {!!getCurSelectAssistantMessagesInMessageContainer()
                .filter(assistantMessage => assistantMessage.eventType === AgentEventTypeEnum.TASK_REASONING).length &&
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-blue-600">任务目标</h2>
                    <p className="text-lg text-slate-800 leading-relaxed font-medium">
                        {getCurSelectAssistantMessagesInMessageContainer()
                            .filter(assistantMessage => assistantMessage.eventType === AgentEventTypeEnum.TASK_REASONING)?.[0]?.content ?? "空"}
                    </p>
                </div>
            }
        </div>
    )
}
