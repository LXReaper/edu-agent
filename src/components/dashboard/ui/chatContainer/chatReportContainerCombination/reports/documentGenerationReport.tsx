import {CircleCheckBig, Download, Eye, FileDown, FileText} from "lucide-react";
import React from "react";
import {Spin} from "antd";

interface DocumentGenerationReportProps {
    isFinish: boolean;// 是否完成了当前的step
    isEndStep: boolean;// 是否是最后一步
    step: number;
    step_name: string;
}

export const DocumentGenerationReport: React.FC<DocumentGenerationReportProps> = ({
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
                    className="z-10 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                    <FileDown className="w-5 h-5"/>
                </div>
                <div className={`flex-1`}>
                    <div className={`flex gap-[3%] items-center`}>
                        <h3 className="text-lg font-bold text-slate-800">步骤 {step}：整合资料生成文档</h3>
                        <div>
                            {isFinish ? <CircleCheckBig color={`green`}/> : <Spin/>}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{step_name}</p>
                </div>
            </div>

            <div className="ml-14 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div
                        className="w-16 h-20 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center text-blue-500">
                        <FileText className="w-8 h-8"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800">2024_折叠屏手机市场调研报告.docx</h4>
                        <p className="text-xs text-slate-400 mt-1">文件大小: 4.2 MB • 页数: 18 页 • 包含 12 张图表</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5"/> 在线预览
                            </button>
                            <button
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
                                <Download className="w-3.5 h-3.5"/> 立即下载
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
