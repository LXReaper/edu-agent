import {CircleCheckBig, ExternalLink, PlayCircle, Search, Video} from "lucide-react";
import React from "react";
import {motion} from "motion/react";
import type {Reference} from "../../../../../../api/entity/tools/BaiduAISearchResponse.ts";
import {Image, Spin} from 'antd';

interface SearchReportProps {
    isFinish: boolean;// 是否完成了当前的step
    isEndStep: boolean;// 是否是最后一步
    step: number;
    step_name: string;
    searchResults: Reference[] | undefined | null;
}

export const SearchReport: React.FC<SearchReportProps> = ({
    isFinish,
    isEndStep,
    step,
    step_name,
    searchResults,
}) => {
    const formatDuration = (sec: string) => {
        const s = parseInt(sec);
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const turnToUrl = (url: string) => {
        window.open(url, "_blank");
    }
    return (
        <div className="relative">
            {!isEndStep && !!searchResults?.length && <div className="absolute left-[19px] top-10 bottom-[-50px] w-0.5 bg-slate-200 hidden md:flex"></div>}
            <div className="flex items-start gap-4 mb-6 hidden md:flex">
                <div
                    className="z-10 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200 flex-shrink-0">
                    <Search className="w-5 h-5"/>
                </div>
                <div className={`flex-1`}>
                    <div className={`flex gap-[3%] items-center`}>
                        <h3 className="text-lg font-bold">步骤 {step}：调用网络搜索工具</h3>
                        <div>
                            {isFinish ? <CircleCheckBig color={`green`} /> : <Spin />}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">关键词: {step_name}</p>
                </div>
            </div>

            {!!searchResults?.length &&
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                        mass: 0.5
                    }}
                    className="max-h-[800px] overflow-y-auto custom-scrollbar ml-14 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((result, index) => {
                            // --- Video 展示效果 ---
                            if (result.type === 'video') {
                                return (
                                    <motion.div
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: index * 0.2,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 15,
                                            mass: 0.5
                                        }}
                                        key={result.id}
                                        className="md:col-span-2 bg-slate-900 text-white border border-slate-800 rounded-xl overflow-hidden shadow-sm group">
                                        <div className="flex gap-4 p-4">
                                            <div
                                                onClick={() => turnToUrl(result.url)}
                                                className="w-48 aspect-video bg-black rounded-lg overflow-hidden relative flex-shrink-0">
                                                <img src={result.video?.hoverPic} alt="Video"
                                                     className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"/>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PlayCircle
                                                        className="w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all"/>
                                                </div>
                                                <div
                                                    className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-[10px] rounded">
                                                    {formatDuration(result.video?.duration || "00:00")}
                                                </div>
                                            </div>
                                            <div className="flex-1 py-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2 text-red-400">
                                                        <Video className="w-3.5 h-3.5"/>
                                                        <span
                                                            className="text-[10px] font-bold uppercase tracking-widest">视频</span>
                                                    </div>
                                                    <h4
                                                        onClick={() => turnToUrl(result.url)}
                                                        className="font-bold text-base leading-tight mb-2 group-hover:text-blue-400 transition-colors cursor-pointer">
                                                        {result.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 line-clamp-2">{result.content}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <img src={result.icon} className="w-4 h-4 rounded-full" alt="icon"/>
                                                    <span className="text-[10px] text-slate-500">{result.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }
                            // --- Image 展示效果 ---
                            if (result.type === 'image') {
                                return (
                                    <motion.div
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: index * 0.2,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 15,
                                            mass: 0.5
                                        }}
                                        key={result.id}
                                        className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                                        <div className="aspect-[3/4] w-full bg-slate-50 overflow-hidden relative">
                                            <Image src={result.image?.url} alt={result.title}
                                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                            <div
                                                className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 rounded text-[9px] text-white backdrop-blur-sm">
                                                {result.image?.width}x{result.image?.height}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <img src={result.icon} className="w-3.5 h-3.5 rounded" alt="icon"/>
                                                <span className="text-[10px] text-slate-400 uppercase">图文素材</span>
                                            </div>
                                            <h4
                                                onClick={() => turnToUrl(result.url)}
                                                className="font-bold text-slate-800 text-xs truncate mb-1 cursor-pointer">
                                                {result.title}
                                            </h4>
                                            <span className="text-[9px] text-slate-400 font-mono">{result.date}</span>
                                        </div>
                                    </motion.div>
                                );
                            }
                            // --- Web 展示效果 ---
                            return (
                                <motion.div
                                    initial={{ y: -100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.2,
                                        type: "spring",
                                        stiffness: 150,
                                        damping: 15,
                                        mass: 0.5
                                    }}
                                    key={result.id}
                                    className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img src={result.icon} className="w-5 h-5 rounded shadow-sm" alt="icon"/>
                                            <span className="text-xs text-slate-400 font-medium">网页</span>
                                        </div>
                                        <ExternalLink onClick={() => turnToUrl(result.url)}
                                            className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 cursor-pointer" />
                                    </div>
                                    <h4
                                        className="font-bold text-blue-600 group-hover:underline text-sm leading-snug cursor-pointer"
                                        onClick={() => turnToUrl(result.url)}>
                                        {result.title}
                                    </h4>
                                    <p className="text-[11px] overflow-y-auto text-slate-500 line-clamp-4 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-50">
                                        {result.content}
                                    </p>
                                    <div className="text-[10px] text-slate-300 flex justify-between items-center mt-auto">
                                        <span>{result.date}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            }
        </div>
    )
}
