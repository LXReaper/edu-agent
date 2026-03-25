import {Maximize2, Presentation} from "lucide-react";
import React from "react";
import {themeConfig} from "../../../../../lib";
import {usePPTXInfo} from "../../../../store/usePPTXInfo.tsx";
import type {SlideInfo} from "../../../../../api/entity/tools/SlideInfo.ts";

interface PptxPreviewOpenMessageProps {
    title: string;
    slideInfo: SlideInfo;
    backGroundColor: string;
}
export const PptxPreviewOpenMessage: React.FC<PptxPreviewOpenMessageProps> = ({
    title,
    slideInfo,
    backGroundColor,
}) => {
    const {openPPTXPreviewContainer} = usePPTXInfo();
    return (
        <div
            onClick={() => openPPTXPreviewContainer(slideInfo.projectId, title)}
            className={`group relative overflow-hidden bg-[${backGroundColor}] rounded-2xl p-4 flex w-[70%]
            ${
                themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                    ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                    : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
            }
            items-center gap-4 cursor-pointer transition-all hover:shadow-lg border-orange-100 hover:border-orange-400`}
        >
            <div className={`p-3 rounded-xl transition-colors bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white`}>
                <Presentation size={24}/>
            </div>
            <div className="flex-1 min-w-0">
                <h4
                    className="font-bold truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    title={slideInfo?.title ?? "PPT预览"}
                >
                    {slideInfo?.title ?? "PPT预览"}
                </h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">
                    幻灯片演示文稿
                </p>
            </div>
            <Maximize2 size={18} className="text-slate-300 group-hover:text-slate-500"/>
        </div>
    )
}
