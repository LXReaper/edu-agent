import React, {useEffect} from "react";
import {motion} from "motion/react";
import {ChevronLeft, FileText} from "lucide-react";
import {AnimatePresence} from "motion/react";
import {useDocxInfo} from "../../../../../store/useDocxInfo.tsx";

export const DocxPreviewContainer = () => {
    const {getFilePath, setTempDocxFileAccessPath, getTempDocxFileAccessPath, closeDocxPreviewContainer, isOpen} = useDocxInfo();


    useEffect(() => {
        setTempDocxFileAccessPath();
    }, [isOpen()]);

    if (!isOpen?.()) return <></>;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[2026] bg-[#f3f2f1] flex flex-col overflow-hidden"
            >
                {/* 全屏顶部导航条 - 独立滑入动画 */}
                <motion.nav
                    initial={{ y: -60 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-[60] shrink-0 print:hidden"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={closeDocxPreviewContainer}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            退出预览
                        </button>
                        <div className="h-6 w-[1px] bg-slate-300 mx-1"></div>
                        <div className="flex items-center gap-2 text-slate-700 max-w-[40vw]">
                            <FileText size={18} className="text-[#2b579a]" />
                            <span className="text-sm font-semibold truncate italic">
                                {getFilePath().split('/').pop() || '预览文档'}
                            </span>
                        </div>
                    </div>

                </motion.nav>

                {/* iframe 渲染主体 - 渐现动画 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`flex-1 bg-white relative`}
                >

                    {!getTempDocxFileAccessPath() ?
                        <div className="w-full h-full text-[25pt] flex font-bold items-center justify-center border-none">
                            正在载入文档中...
                        </div>
                        : <iframe
                            id="preview-iframe"
                            src={getTempDocxFileAccessPath()}
                            className="w-full h-full border-none"
                            title="Office Online Viewer"
                        >
                            您的浏览器不支持 iframe，请升级浏览器。
                        </iframe>
                    }
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
