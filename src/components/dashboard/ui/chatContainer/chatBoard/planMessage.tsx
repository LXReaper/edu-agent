import React, {useEffect, useRef, useState} from "react";
import {
    Brain,
    CheckCircle2,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    FileCode,
    FileText,
    LayoutList,
    ListTodo,
    Loader2,
    Package,
    Play,
    PlusCircle,
    Wrench,
    X,
} from 'lucide-react';
import {CssVariableNames, themeConfig} from "../../../../../lib";
import {AgentEventTypeEnum} from "../../../../../api/entity/enums/AgentEventTypeEnum.ts";
import type {TodoStep} from "../../../../../api/entity/TodoStep.ts";
import {isTodoStepType} from "../../../../../api/entity/TodoStep.ts";
import {CommonUtils} from "../../../../../utils";
import type {ThoughtStep} from "../../../../../type";
import type {ChatSessionMessage} from "../../../../../api/entity/models/ChatSessionMessage.ts";
import moment from "moment";
import type {AgentEventResponseCoreContent} from "../../../../../api/entity/AgentEventResponseCoreContent.ts";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";
import {ValidPlanEventTypes} from "../../../../../constants";
import {ToolNameTypeEnum} from "../../../../../api/entity/enums/ToolNameTypeEnum.ts";


interface PlanMessageProps {
    index: number;
    backGroundColor: string;
    newAssistantMessage: ChatSessionMessage;
}
export const PlanMessage: React.FC<PlanMessageProps> = ({
    index,
    backGroundColor,
    newAssistantMessage,
}) => {
    const store = useCurChatSessionMessagesStore.getState?.();

    const [lastItem, setLastItem] = useState<ThoughtStep>();
    const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasStarted = useRef(false);

    const updateThoughtSteps = (nextItem: ThoughtStep) => {
        if (nextItem) {
            CommonUtils.doSomethingByCondition(nextItem.type === AgentEventTypeEnum.SKILLS_NEEDED, () => {
                nextItem.meta = {
                    skillNames: JSON.parse(nextItem.content)
                }
                nextItem.content = "";
            });
            CommonUtils.doSomethingByCondition(nextItem.type === AgentEventTypeEnum.TODO_STEP_GET, () => {
                nextItem.meta = {
                    todoSteps: JSON.parse(nextItem.content)
                }
                nextItem.content = "";
            });
            CommonUtils.doSomethingByCondition(nextItem.type === AgentEventTypeEnum.THINKING || nextItem.type === AgentEventTypeEnum.THINKING_DONE, () => {
                const agentEventResponseCoreContent = JSON.parse(nextItem.content) as AgentEventResponseCoreContent;
                if (agentEventResponseCoreContent.content) {
                    try {
                        const thinkingContentObj = JSON.parse(agentEventResponseCoreContent.content);
                        if (isTodoStepType(thinkingContentObj)) {
                            nextItem.meta = {
                                curStep: thinkingContentObj
                            }
                        }
                    } catch (e) {// 是普通字符串
                        console.error(e);
                    }
                }
                nextItem.content = agentEventResponseCoreContent.message;
            });
            setThoughtSteps(prev => [...prev, nextItem]);
        }
    }

    useEffect(() => {
        const assistantMessages = store.getAssistantMessagesInMessageContainer(index) as ChatSessionMessage[];
        if (hasStarted.current || assistantMessages.length <= 0 || !store.isReceiveSuccess) return ;
        hasStarted.current = true;
        setIsThinking(true);
        setExpanded(true);
        let nextItem = {} as ThoughtStep;
        for (const assistantMessage of assistantMessages) {
            if (!assistantMessage.eventType || !ValidPlanEventTypes.includes(assistantMessage.eventType)) continue;
            nextItem = {
                id: assistantMessage.id + "",
                type: assistantMessage.eventType,
                content: assistantMessage.content,
                createTime: assistantMessage.createTime,
                sequenceNumber: assistantMessage.sequenceNumber
            };
            updateThoughtSteps(nextItem);
        }
        setLastItem(nextItem);
        if (nextItem && nextItem.type === AgentEventTypeEnum.THINKING_DONE) {
            // --- 核心逻辑：思考完成后自动收起 ---
            setIsThinking(false);
            setExpanded(false);
        }
    }, [store.isReceiveSuccess]);

    useEffect(() => {
        if (newAssistantMessage && newAssistantMessage.eventType && ValidPlanEventTypes.includes(newAssistantMessage.eventType)) {
            setExpanded(true);
            setIsThinking(true);
            const nextItem = {
                id: newAssistantMessage.id + "",
                type: newAssistantMessage.eventType,
                content: newAssistantMessage.content,
                createTime: newAssistantMessage.createTime,
                sequenceNumber: newAssistantMessage.sequenceNumber
            };
            updateThoughtSteps(nextItem);
            setLastItem(nextItem);
            setIsThinking(false);
            setExpanded(false);
        }
    }, [newAssistantMessage]);


    // 自动滚动到最新内容
    useEffect(() => {
        if (scrollRef.current && expanded) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [thoughtSteps, expanded]);

    const getIcon = (type: ThoughtStep['type'], message = "") => {
        switch (type) {
            case AgentEventTypeEnum.THINKING: return <Brain className="w-5 h-5 text-blue-500" />;
            case AgentEventTypeEnum.SKILLS_NEEDED: return <Wrench className="w-5 h-5 text-amber-500" />;
            case AgentEventTypeEnum.TASK_REASONING: return <PlusCircle className="w-5 h-5 text-purple-500" />;
            case AgentEventTypeEnum.TODO_STEP_GET: return <LayoutList className="w-5 h-5 text-indigo-500" />;
            case AgentEventTypeEnum.THINKING_DONE: {
                if (message.includes("❌ ERROR")) return <X className="w-5 h-5 text-red-500" />;
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            }
            default: return <Brain className="w-5 h-5 text-slate-500" />;
        }
    };

    const getBgColor = (type: ThoughtStep['type'], message = "") => {
        switch (type) {
            case AgentEventTypeEnum.THINKING: return 'bg-blue-50/80 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800';
            case AgentEventTypeEnum.SKILLS_NEEDED: return 'bg-amber-50/80 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800';
            case AgentEventTypeEnum.TASK_REASONING: return 'bg-purple-50/80 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800';
            case AgentEventTypeEnum.TODO_STEP_GET: return 'bg-indigo-50/80 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800';
            case AgentEventTypeEnum.THINKING_DONE: {
                if (message.includes("❌ ERROR")) return 'bg-red-50/80 border-red-100 dark:bg-red-900/20 dark:border-red-800';
                return 'bg-green-50/80 border-green-100 dark:bg-green-900/20 dark:border-green-800';
            }
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    const getLabel = (type: AgentEventTypeEnum | undefined) => {
        if (!type) return "";
        const labels: Record<string, string> = {
            [AgentEventTypeEnum.THINKING]: '深度思考',
            [AgentEventTypeEnum.SKILLS_NEEDED]: '技能调用',
            [AgentEventTypeEnum.TASK_REASONING]: '任务分析',
            [AgentEventTypeEnum.TODO_STEP_GET]: '总体任务规划',
            [AgentEventTypeEnum.THINKING_DONE]: '思考结束'
        };
        return labels[type] || type;
    };

    const getStepIcon = (todo: TodoStep) => {
        if (todo.type === 'final_answer') return <FileText className="w-3.5 h-3.5 text-green-500" />;
        switch (todo.tool_name) {
            case ToolNameTypeEnum.WRITE_FILE: return <FileCode className="w-3.5 h-3.5 text-blue-500" />;
            case ToolNameTypeEnum.EXECUTE_NPM_INSTALL: return <Package className="w-3.5 h-3.5 text-amber-500" />;
            case ToolNameTypeEnum.EXECUTE_JAVASCRIPT_DOCX: return <Play className="w-3.5 h-3.5 text-indigo-500" />;
            default: return <CheckSquare className="w-3.5 h-3.5 text-slate-400" />;
        }
    };

    if (thoughtSteps.length <= 0) return (<></>);
    return (
        <div
            className={`w-full max-w-2xl bg-[${backGroundColor}]
             text-[${CssVariableNames.dashboardForegroundColor}]
             ${
                themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                    ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                    : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
            }
             rounded-2xl overflow-hidden`}>

            {/* 头部标题栏 - 始终保持可点击以切换展开/收起 */}
            <div
                className={`
                    flex items-center justify-between p-4 cursor-pointer 
                    ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "hover:bg-slate-200" : "hover:bg-slate-700"}
                    transition-colors
                `}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2 rounded-lg ${isThinking ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                        <Brain
                            className={`w-5 h-5 ${isThinking ? 'text-blue-600 dark:text-blue-400 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">LLM 思维推理链</span>
                        <span
                            className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                            {isThinking ? (
                                <>
                                    <Loader2 className="w-2.5 h-2.5 animate-spin"/>
                                    正在生成思维路径...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-2.5 h-2.5 text-green-500"/>
                                    思考已完成
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!expanded && thoughtSteps.length > 0 && !isThinking && (
                        <span
                            className="text-[10px] px-2 py-0.5 rounded-full">
                            共 {thoughtSteps.length} 步
                        </span>
                    )}
                    <div className="p-1 rounded-md">
                        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400"/> :
                            <ChevronDown className="w-4 h-4 text-slate-400"/>}
                    </div>
                </div>
            </div>

            {/* 思考链路时间线 */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`p-4 bg-[${backGroundColor}] text-[${CssVariableNames.dashboardForegroundColor}]`}>
                    <div
                        ref={scrollRef}
                        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {thoughtSteps.map((step) => {
                            if (!step || !step.id) return null;
                            return (
                                <div
                                    key={step.id}
                                    className={`flex gap-3.5 p-4 rounded-xl border border-transparent shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${getBgColor(step.type, step.content)}`}
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        {getIcon(step.type, step.content)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                          {getLabel(step.type)}
                                        </span>
                                            <span className="text-[10px] opacity-40 font-mono">
                                          {moment(step.createTime).format("YYYY年MM月DD日 hh时mm分ss秒")}
                                        </span>
                                        </div>
                                        {step.content &&
                                            <p className={`
                                                text-sm 
                                                 ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "text-slate-700" : "text-slate-200"}
                                                 leading-relaxed font-medium
                                            `}>
                                                {step.content}
                                            </p>
                                        }

                                        {step.meta?.skillNames && (
                                            <div className={`flex gap-[1%]`}>
                                                {step.meta.skillNames.map(((skillName, index) => (
                                                    <div
                                                        key={index}
                                                        className={`
                                                            flex items-center gap-2 mt-3 px-2.5 py-1 
                                                            ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "bg-slate-900/40 border-slate-700/50" : "bg-white/30 border-slate-200/50"}
                                                            rounded-lg w-fit border
                                                        `}>
                                                        <span
                                                            className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                                                            {skillName}
                                                        </span>
                                                    </div>
                                                )))}
                                            </div>
                                        )}
                                        {step.meta?.todoSteps && (
                                            <div
                                                className="mt-4 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-indigo-100 dark:border-indigo-800/40 overflow-hidden shadow-sm">
                                                <div
                                                    className="px-3 py-2 bg-indigo-50/80 dark:bg-indigo-900/60 border-b border-indigo-100/50 dark:border-indigo-800/30 flex items-center gap-2">
                                                    <ListTodo className="w-3.5 h-3.5 text-indigo-500"/>
                                                    <span
                                                        className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase">内部执行流预案</span>
                                                </div>
                                                <div className="divide-y divide-indigo-50/50 dark:divide-indigo-800/20">
                                                    {step.meta.todoSteps.map((todo, idx) => (
                                                        <div key={idx}
                                                             className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50/20 transition-colors">
                                                            <div
                                                                className="flex-shrink-0 w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                {todo.step}
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                {getStepIcon(todo)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`text-xs font-semibold truncate`}>
                                                                    {todo.step_name}
                                                                </div>
                                                                {todo.tool_name && (
                                                                    <div
                                                                        className="text-[12px] font-mono text-indigo-500/90 mt-0.5">
                                                                        调用工具: {todo.tool_name}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isThinking && (
                            <div
                                className="flex items-center gap-3 p-4 text-slate-400 dark:text-slate-500 animate-pulse bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <div className="relative">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500"/>
                                </div>
                                <span className="text-xs font-medium italic">LLM 正在展开后续逻辑...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #e2e8f0;
                  border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #334155;
                }
                .animate-in {
                  animation: enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes enter {
                  from { opacity: 0; transform: translateY(12px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
        </div>
    );
}
