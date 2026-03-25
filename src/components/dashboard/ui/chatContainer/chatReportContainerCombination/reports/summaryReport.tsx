import {CheckCircle2, CircleCheckBig, Copy, ExternalLink} from "lucide-react";
import React, {useState} from "react";
import {Spin} from "antd";
import {MdViewer} from "../../../../../mdEditor/mdViewer.tsx";
import removeMd from "remove-markdown";

interface SummaryReportProps {
    isFinish: boolean;// 是否完成了当前的step
    isEndStep: boolean;// 是否是最后一步
    step: number;
    step_name: string;
    summaryContent: string;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({
    isFinish,
    isEndStep,
    step,
    step_name,
    summaryContent,
}) => {
    const [copied, setCopied] = useState(false);


    const handleCopy = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            {!isEndStep && !!summaryContent && <div className="absolute left-[19px] top-10 bottom-[-50px] w-0.5 bg-slate-200 hidden md:flex"></div>}
            <div className="flex items-start gap-4 mb-6 hidden md:flex">
                <div
                    className="z-10 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5"/>
                </div>
                <div className={`flex-1`}>
                    <div className={`flex gap-[3%] items-center`}>
                        <h3 className="text-lg font-bold text-slate-800">步骤 {step}：总结并输出报告</h3>
                        <div>
                            {isFinish ? <CircleCheckBig color={`green`}/> : <Spin/>}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{step_name}</p>
                </div>
            </div>

            {summaryContent &&
                <div
                    className="ml-14 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <MdViewer content={summaryContent} />
                        {isFinish &&
                            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-emerald-100">
                                <button
                                    onClick={() => handleCopy(removeMd(summaryContent))}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                                        copied ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <Copy className="w-4 h-4"/>
                                    {copied ? '已复制报告' : '复制'}
                                </button>
                                <button
                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all">
                                    <ExternalLink className="w-4 h-4"/>
                                    查看完整附件集
                                </button>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
