import {BarChart3, CircleCheckBig, Layout} from "lucide-react";
import React from "react";
import {Spin} from "antd";

interface DataAnalysisReportProps {
    isFinish: boolean;// 是否完成了当前的step
    isEndStep: boolean;// 是否是最后一步
    step: number;
    step_name: string;
}

export const DataAnalysisReport: React.FC<DataAnalysisReportProps> = ({
    isFinish,
    isEndStep,
    step,
    step_name,
}) => {
    return (
        <div className="relative">
            {!isEndStep && <div className="absolute left-[19px] top-10 bottom-[-50px] w-0.5 bg-slate-200 hidden md:flex"></div>}
            <div className="flex items-start gap-4 mb-6 hidden md:flex">
                <div
                    className="z-10 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 flex-shrink-0">
                    <BarChart3 className="w-5 h-5"/>
                </div>
                <div className={`flex-1`}>
                    <div className={`flex gap-[3%] items-center`}>
                        <h3 className="text-lg font-bold text-slate-800">步骤 {step}：分析报告</h3>
                        <div>
                            {isFinish ? <CircleCheckBig color={`green`}/> : <Spin/>}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{step_name}</p>
                </div>
            </div>

            <div className="ml-14 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Layout className="w-4 h-4"/>
                        </div>
                        <span className="text-sm font-bold">深度对比图表</span>
                    </div>
                    <span className="text-xs text-slate-400">更新于 2 分钟前</span>
                </div>
                <div className="space-y-4">
                    {[
                        {brand: '荣耀 Magic V3', value: '95%', color: 'bg-blue-500'},
                        {brand: '三星 Z Fold 6', value: '88%', color: 'bg-indigo-500'},
                        {brand: '华为 Mate X5', value: '92%', color: 'bg-red-500'}
                    ].map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span>{item.brand}</span>
                                <span>满意度 {item.value}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full">
                                <div className={`h-full ${item.color} rounded-full`} style={{width: item.value}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
