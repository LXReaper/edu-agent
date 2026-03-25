import React, {useEffect, useState} from "react";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Database,
    Loader2,
    RefreshCcw,
    Wrench,
    XCircle
} from "lucide-react";
import type {StepContainer} from "../../../../../type";
import {StepsStatusEnum} from "../../../../../type";
import type {AgentEventResponseCoreContent} from "../../../../../api/entity/AgentEventResponseCoreContent.ts";
import type {TodoStep} from "../../../../../api/entity/TodoStep.ts";
import {AgentEventTypeEnum} from "../../../../../api/entity/enums/AgentEventTypeEnum.ts";
import type {ToolResult} from "../../../../../api/entity/ToolResult.ts";
import {ToolNameTypeEnum} from "../../../../../api/entity/enums/ToolNameTypeEnum.ts";
import type {SlideInfo} from "../../../../../api/entity/tools/SlideInfo.ts";
import {PptxPreviewOpenMessage} from "../chatBoard/pptxPreviewOpenMessage.tsx";
import {CssVariableNames} from "../../../../../lib";
import {MdViewer} from "../../../../mdEditor/mdViewer.tsx";
import {DocxPreviewOpenMessage} from "../chatBoard/docxPreviewOpenMessage.tsx";
import type {BaiduAISearchResponse} from "../../../../../api/entity/tools/BaiduAISearchResponse.ts";
import {BaiduSearchMessage} from "./search/baiduSearchMessage.tsx";

interface StepCardProps {
    stepContainer: StepContainer;
    status: StepsStatusEnum;
    isWorking: boolean;
}
export const StepCard: React.FC<StepCardProps> = ({
    stepContainer,
    status,
    isWorking,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [stepName, setStepName] = useState("");

    // 当状态变为错误时，自动展开以提醒用户
    useEffect(() => {
        if (status === StepsStatusEnum.ERROR) {
            setIsOpen(true);
        }
    }, [status]);
    useEffect(() => {
        if (stepContainer && stepContainer.stepMessages && stepContainer.stepMessages.length) {
            const coreContentObj = JSON.parse(stepContainer.stepMessages[0].content) as AgentEventResponseCoreContent;
            const todoStep = JSON.parse(coreContentObj.content) as TodoStep;
            setStepName(todoStep.step_name);
        }
    }, [stepContainer]);

    const getStatusConfig = () => {
        switch (status) {
            case StepsStatusEnum.RUNNING: return { icon: <Loader2 className="w-5 h-5 animate-spin text-blue-500" />, color: 'border-blue-200 bg-blue-50/40', label: '进行中' };
            case StepsStatusEnum.DONE: return { icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, color: 'border-green-200 bg-green-50/30', label: '已完成' };
            case StepsStatusEnum.ERROR: return { icon: <XCircle className="w-5 h-5 text-red-500" />, color: 'border-red-200 bg-red-50/40', label: '运行失败' };
            case StepsStatusEnum.RESTARTED: return { icon: <RefreshCcw className="w-5 h-5 text-orange-500" />, color: 'border-orange-200 bg-orange-50/30', label: '已重启' };
        }
    };

    const config = getStatusConfig();
    return (
        <div
            className={`mb-6 border rounded-xl overflow-hidden transition-all duration-300 ${config.color} ${isWorking ? 'shadow-lg ring-1 ring-blue-300' : 'shadow-sm opacity-90'}`}>
            {/* 头部：可点击以展开/闭合 */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b border-inherit cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {config.icon}
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">{stepName}</h3>
                        <p className="text-[10px] text-slate-500 font-medium">
                            包含 {stepContainer && stepContainer.stepMessages ? stepContainer.stepMessages.length : 0} 条执行日志
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/60 border border-inherit text-slate-600 uppercase tracking-wider">
                        {config.label}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                </div>
            </div>

            {/* 内容区：带有高度过渡动画 */}
            {stepContainer && stepContainer.stepMessages &&
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? '' : 'hidden'}`}>
                    <div className="p-4 bg-slate-900/90 font-mono text-sm space-y-1.5 min-h-[60px] overflow-y-auto custom-scrollbar">
                        {stepContainer.stepMessages.map((chatMessage) => {
                            const sessionId = chatMessage.sessionId;
                            switch (chatMessage.eventType) {
                                case AgentEventTypeEnum.TOOL_CALL:
                                    return (
                                        <div
                                            key={chatMessage.id}
                                            className="my-2 p-3 bg-indigo-500/10 border-l-4 border-indigo-400 rounded-r-md animate-in slide-in-from-left-2">
                                            <div className="flex items-center gap-2 text-indigo-300 mb-1">
                                                <Wrench size={14}/>
                                                <span
                                                    className="text-xs font-bold uppercase tracking-tighter">调用工具(Tool Call)</span>
                                            </div>
                                            <code className="text-xs text-indigo-100 break-all">{chatMessage.content}</code>
                                        </div>
                                    );
                                case AgentEventTypeEnum.TOOL_RESULT: {
                                    const toolResult = JSON.parse(chatMessage.content) as ToolResult;
                                    if (!toolResult.succeed && toolResult.errorType)
                                        return (
                                            <div
                                                key={chatMessage.id}
                                                className="my-2 p-3 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-md animate-in slide-in-from-left-2">
                                                <div className="flex items-center gap-2 text-rose-400 mb-1">
                                                    <AlertTriangle size={14}/>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">执行失败 (Tool Error)</span>
                                                </div>
                                                <code className="text-xs text-rose-200 break-all font-semibold">{toolResult.message}</code>
                                            </div>
                                        )

                                    let successMessage = "工具 [" + toolResult.tool + "] 执行成功";
                                    switch (toolResult.tool) {
                                        case ToolNameTypeEnum.WEB_SEARCH: {
                                            const aiSearchResponse = JSON.parse(toolResult.data) as BaiduAISearchResponse;
                                            const references = aiSearchResponse.references;
                                            return (
                                                <div
                                                    key={chatMessage.id}
                                                    className="my-2 p-3 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-md animate-in slide-in-from-left-2">
                                                    <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                                        <Database size={14}/>
                                                        <span
                                                            className="text-xs font-bold uppercase tracking-tighter">执行结果 (Tool Result)</span>
                                                    </div>
                                                    <BaiduSearchMessage searchResults={references} />
                                                </div>
                                            );
                                        }
                                        case ToolNameTypeEnum.CREATE_RICH_PPT: {
                                            const slideInfo = JSON.parse(toolResult.data) as SlideInfo;
                                            return (
                                                <div
                                                    key={chatMessage.id}
                                                    className="my-2 p-3 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-md animate-in slide-in-from-left-2">
                                                    <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                                        <Database size={14}/>
                                                        <span
                                                            className="text-xs font-bold uppercase tracking-tighter">执行结果 (Tool Result)</span>
                                                    </div>
                                                    <PptxPreviewOpenMessage title={slideInfo.title} slideInfo={slideInfo} backGroundColor={CssVariableNames.dashBoardTextBoardColor}/>
                                                </div>
                                            );
                                        }
                                        case ToolNameTypeEnum.EXECUTE_NPM_INSTALL:
                                            successMessage = toolResult.data;
                                            break;
                                        case ToolNameTypeEnum.EXECUTE_JAVASCRIPT_DOCX: {
                                            const filePath = toolResult.data;
                                            return (
                                                <div
                                                    key={chatMessage.id}
                                                    className="my-2 p-3 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-md animate-in slide-in-from-left-2">
                                                    <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                                        <Database size={14}/>
                                                        <span
                                                            className="text-xs font-bold uppercase tracking-tighter">执行结果 (Tool Result)</span>
                                                    </div>
                                                    <DocxPreviewOpenMessage chatSessionId={sessionId} filePath={filePath}
                                                                            backGroundColor={CssVariableNames.dashBoardTextBoardColor}/>
                                                </div>
                                            );
                                        }
                                        case ToolNameTypeEnum.WRITE_FILE:
                                            // toolResult.data是某个文件在工作目录下的路径，此处使用默认的消息
                                            break;
                                    }
                                    return (
                                        <div
                                            key={chatMessage.id}
                                            className="my-2 p-3 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-md animate-in slide-in-from-left-2">
                                            <div className="flex items-center gap-2 text-emerald-300 mb-1">
                                                <Database size={14}/>
                                                <span
                                                    className="text-xs font-bold uppercase tracking-tighter">执行结果 (Tool Result)</span>
                                            </div>
                                            <code className="text-xs text-emerald-100 break-all">{successMessage}</code>
                                        </div>
                                    )
                                }
                                default: {
                                    const coreContentObj = JSON.parse(chatMessage.content) as AgentEventResponseCoreContent;
                                    // const todoStep = JSON.parse(coreContentObj.content) as TodoStep;
                                    const message = coreContentObj.message;
                                    return (
                                        <div
                                            key={chatMessage.id}
                                             className="flex gap-2 text-slate-200 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <ChevronRight
                                                className="w-3.5 h-3.5 mt-1 flex-shrink-0 opacity-80 text-indigo-300"/>
                                            <span
                                                className={`${chatMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS_ERROR ? 'text-red-300' : 'text-slate-200'}`}>
                                                <MdViewer content={message} />
                                            </span>
                                        </div>
                                    )
                                }
                            }
                        })}
                        {status === StepsStatusEnum.RUNNING && (
                            <div className="flex gap-2 items-center text-blue-400 pl-8 pt-1">
                                <div className="w-2 h-4 bg-blue-500 animate-pulse"/>
                                <span className="italic text-xs opacity-80 font-sans">执行步骤中...</span>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
}
