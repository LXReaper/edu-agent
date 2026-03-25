import {StepCard} from "./stepCard.tsx";
import React, {useEffect, useRef} from "react";
import type {ChatSessionMessage} from "../../../../../api/entity/models/ChatSessionMessage.ts";
import {StepsStatusEnum} from "../../../../../type";
import {useCurReportStepsInfoStore} from "../../../../store/useCurReportStepsInfoStore.tsx";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";
import {ValidStepMessageTypes} from "../../../../../constants";

interface StepFlowContainerProps {
    newMessage: ChatSessionMessage;
}
export const StepFlowContainer: React.FC<StepFlowContainerProps> = ({
    newMessage,
}) => {
    const curChatSessionMessagesStore = useCurChatSessionMessagesStore.getState?.();
    const store = useCurReportStepsInfoStore.getState?.();
    const {stepsContainerUpdate} = useCurReportStepsInfoStore();

    const logEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        const messages = curChatSessionMessagesStore.getCurSelectAssistantMessagesInMessageContainer();
        if (messages && messages.length) {
            store.clearStepsContainer();
            for (const message of messages) {
                if (!message || !message.eventType || !ValidStepMessageTypes.includes(message.eventType)) continue ;
                stepsContainerUpdate(message.eventType, message);
                scrollToBottom();
            }
        }
    }, []);
    useEffect(() => {
        if (newMessage && newMessage.eventType && ValidStepMessageTypes.includes(newMessage.eventType)) {
            stepsContainerUpdate(newMessage.eventType, newMessage);
            scrollToBottom();
        }
    }, [newMessage]);

    return (
        <>
            {store.getStepsContainerLength() > 0 ?
                <div className="font-sans text-slate-900">
                    <div className="max-w-3xl mx-auto">
                        {/* Timeline Area */}
                        <div className="relative border-l-2 border-slate-200 ml-3 pl-8 space-y-2">
                            {[...Array(store.getStepsContainerLength()).keys()].map((idx) => {
                                const stepContainer = store.getSteps(idx);
                                return (
                                    <div key={idx} className="relative group">
                                        {/* Timeline dot */}
                                        <div
                                            className={`absolute -left-[41px] top-5 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 transition-all duration-500 ${
                                                stepContainer.status === StepsStatusEnum.DONE ? 'bg-green-500' :
                                                    stepContainer.status === StepsStatusEnum.ERROR ? 'bg-red-500' :
                                                        stepContainer.status === StepsStatusEnum.RESTARTED ? 'bg-orange-500' :
                                                            'bg-blue-500 scale-110'
                                            }`}/>
                                        <StepCard
                                            stepContainer={stepContainer}
                                            status={stepContainer.status}
                                            isWorking={stepContainer.status === StepsStatusEnum.RUNNING || stepContainer.status === StepsStatusEnum.RESTARTED}
                                        />
                                    </div>
                                )
                            })}
                            <div ref={logEndRef} className="h-10"/>
                        </div>

                        {/* Footer Info */}
                        {/*<div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 flex gap-4 items-start shadow-sm">*/}
                        {/*    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">*/}
                        {/*        <AlertCircle size={20}/>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <h4 className="font-bold text-slate-800 text-sm mb-1.5">操作提示</h4>*/}
                        {/*        <ul className="text-xs text-slate-500 space-y-1.5 leading-relaxed">*/}
                        {/*            <li className="flex gap-2"><span>•</span> 运行过程中，活跃步骤会自动展开，完成后可手动闭合。*/}
                        {/*            </li>*/}
                        {/*            <li className="flex gap-2"><span>•</span> <span*/}
                        {/*                className="text-orange-600 font-semibold italic">RESTART</span> 触发后将保留失败快照并生成平行的重试分支。*/}
                        {/*            </li>*/}
                        {/*            <li className="flex gap-2"><span>•</span> 使用黑色终端风格渲染详细执行日志。</li>*/}
                        {/*        </ul>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div> :
                <></>
            }
        </>
    );
}
