import {CircleCheckBig, Download, Presentation} from "lucide-react";
import React, {useState} from "react";
import {Spin} from "antd";

interface PPTSlide {
    id: number;
    title: string;
    content: string[];
}

interface PptGenerationReportProps {
    isFinish: boolean;// 是否完成了当前的step
    isEndStep: boolean;// 是否是最后一步
    step: number;
    step_name: string;
}

export const PptGenerationReport: React.FC<PptGenerationReportProps> = ({
    isFinish,
    isEndStep,
    step,
    step_name,
}) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const pptSlides: PPTSlide[] = [
        { id: 1, title: "2024 行业趋势综述", content: ["全球出货量增长 25%", "核心驱动力：轻薄与 AI", "品牌竞争格局变化"] },
        { id: 2, title: "技术规格对比", content: ["铰链技术演进", "屏幕折痕优化", "电池与散热方案"] },
        { id: 3, title: "AI 软件生态", content: ["分屏协作优化", "跨设备互联", "生成式 AI 工具集成"] },
        { id: 4, title: "AI 软件生态", content: ["分屏协作优化", "跨设备互联", "生成式 AI 工具集成"] },
        { id: 5, title: "AI 软件生态", content: ["分屏协作优化", "跨设备互联", "生成式 AI 工具集成"] },
        { id: 6, title: "AI 软件生态", content: ["分屏协作优化", "跨设备互联", "生成式 AI 工具集成"] },
        { id: 7, title: "AI 软件生态", content: ["分屏协作优化", "跨设备互联", "生成式 AI 工具集成"] },
    ];
    return (
        <div className="relative">
            {!isEndStep && <div className="absolute left-[19px] top-10 bottom-[-50px] w-0.5 bg-slate-200 hidden md:flex"></div>}
            <div className="flex items-start gap-4 mb-6 hidden md:flex">
                <div
                    className="z-10 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200 flex-shrink-0">
                    <Presentation className="w-5 h-5"/>
                </div>
                <div className={`flex-1`}>
                    <div className={`flex gap-[3%] items-center`}>
                        <h3 className="text-lg font-bold text-slate-800">步骤 {step}：自动排版并生成可视化演示幻灯片</h3>
                        <div>
                            {isFinish ? <CircleCheckBig color={`green`}/> : <Spin/>}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{step_name}</p>
                </div>
            </div>

            <div className="ml-14 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative">
                <div className="flex gap-4">
                    {/* PPT Preview area */}
                    <div
                        className="flex-1 bg-white aspect-[16/9] rounded-lg shadow-2xl p-8 flex flex-col justify-center transition-all duration-500 transform scale-100">
                        <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">{pptSlides[activeSlide].title}</h4>
                            <ul className="space-y-3">
                                {pptSlides[activeSlide].content.map((li, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Thumbnails */}
                    <div className="w-[20%] flex flex-col gap-2">
                        <div
                            className={`flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar`}>
                            {pptSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    onClick={() => setActiveSlide(index)}
                                    className={`cursor-pointer aspect-[16/9] rounded border-2 transition-all ${activeSlide === index ? 'border-orange-500 scale-105' : 'border-slate-600 opacity-50'}`}
                                >
                                    <div
                                        className="bg-white w-full h-full rounded-sm p-1 text-[4px] overflow-hidden text-slate-400">
                                        <div className="font-bold mb-1 text-slate-800">{slide.title}</div>
                                        <div>Content preview text...</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-2 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1">
                            <Download className="w-3 h-3"/> 下载 PPTX
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
