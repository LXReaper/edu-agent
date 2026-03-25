import React from "react";
import {themeConfig} from "../../../../../lib";
import {FileText, Maximize2} from "lucide-react";
import {useDocxInfo} from "../../../../store/useDocxInfo.tsx";

interface DocxPreviewOpenMessageProps {
    chatSessionId: string;
    filePath: string;
    backGroundColor: string;
}
export const DocxPreviewOpenMessage: React.FC<DocxPreviewOpenMessageProps> = ({
    chatSessionId,
    filePath,
    backGroundColor,
}) => {
    const {openDocxPreviewContainer} = useDocxInfo();

    return (
        <div
            onClick={() => openDocxPreviewContainer(chatSessionId, filePath)}
            className={`group relative overflow-hidden bg-[${backGroundColor}] rounded-2xl p-4 flex w-[70%]
            ${
                themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                    ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                    : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
            }
            items-center gap-4 cursor-pointer transition-all hover:shadow-lg border-blue-100 hover:border-blue-400`}
        >
            <div
                className={`p-3 rounded-xl transition-colors bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white`}>
                <FileText size={24}/>
            </div>
            <div className="flex-1 min-w-0">
                <h4
                    className="font-bold truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    title={filePath?.split("/").pop() ?? ""}
                >
                    {filePath?.split("/").pop() ?? ""}
                </h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">
                    DOCX 详细报告
                </p>
            </div>
            <Maximize2 size={18} className="text-slate-300 group-hover:text-slate-500"/>
        </div>
    )
}
