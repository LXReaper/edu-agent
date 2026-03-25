import type {Reference} from "../../../../../../api/entity/tools/BaiduAISearchResponse.ts";
import React, {useMemo, useState} from "react";
import {motion} from "motion/react";
import {ChevronRight, ExternalLink, Filter, Globe, ImageIcon, Video} from "lucide-react";
import {BaiduAISearchReferenceType} from "../../../../../../api/entity/tools/BaiduAISearchResponse.ts";

interface BaiduSearchMessageProps {
    searchResults: Reference[];
}

enum FilterTypeEnum {
    ALL = "all",
    IMAGE = BaiduAISearchReferenceType.IMAGE,
    VIDEO = BaiduAISearchReferenceType.VIDEO,
    WEB = BaiduAISearchReferenceType.WEB,
}
export const BaiduSearchMessage: React.FC<BaiduSearchMessageProps> = ({
    searchResults,
}) => {
    const [filter, setFilter] = useState<FilterTypeEnum>(FilterTypeEnum.ALL);
    const filteredResults = useMemo(() => {
        return searchResults.filter(item =>
            filter === FilterTypeEnum.ALL || item.type === filter.toString()
        );
    }, [filter]);
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.5
            }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                        {id: FilterTypeEnum.ALL, label: '全部结果', icon: Filter},
                        {id: FilterTypeEnum.WEB, label: '深度文章', icon: Globe},
                        {id: FilterTypeEnum.VIDEO, label: '视频资料', icon: Video},
                        {id: FilterTypeEnum.IMAGE, label: '图文资料', icon: ImageIcon},
                    ].map((tab) => (
                        <button
                            key={tab.id.toString()}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                filter === tab.id
                                    ? 'bg-[#4A5A3F] text-white shadow-md'
                                    : 'bg-white border border-[#EBE9E0] text-[#7A7F73] hover:bg-[#F2F1E9]'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredResults.map((result) => (
                    <div
                        key={result.id}
                        className="group bg-white rounded-2xl border border-[#EBE9E0] p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg hover:shadow-[#8DA47E]/5 transition-all duration-300"
                    >
                        {/* 媒体缩略图 - 针对 Agent 结果做紧凑布局 */}
                        {(result.type === FilterTypeEnum.IMAGE.toString() || result.type === FilterTypeEnum.VIDEO.toString()) && (
                            <div
                                className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F2F1E9] relative">
                                <img
                                    src={result.type === FilterTypeEnum.IMAGE.toString() ? result.image?.url : result.video?.hoverPic}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                                    alt=""
                                />
                                {result.type === FilterTypeEnum.VIDEO.toString() && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div
                                            className="w-7 h-7 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <div
                                                className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-col mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <img src={result.icon} className="w-3.5 h-3.5 rounded-sm" alt=""/>
                                    <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                                        {new URL(result.url).hostname}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400">{result.date}</span>
                            </div>

                            <h3 className="text-md font-bold text-[#2D3426] mb-1.5 line-clamp-1 group-hover:text-[#8DA47E] transition-colors">
                                {result.title}
                            </h3>

                            <p className="text-xs text-[#7A7F73] leading-relaxed line-clamp-2 mb-3">
                                {result.content}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <a
                                    href={result.url}
                                    target="_blank"
                                    className="text-[11px] font-bold text-[#8DA47E] flex items-center gap-0.5 hover:underline"
                                >
                                    查看原文 <ChevronRight size={12}/>
                                </a>
                                <button className="p-1 hover:bg-[#F2F1E9] rounded-md transition-colors text-gray-400">
                                    <ExternalLink size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
