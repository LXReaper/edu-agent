import React, { useEffect, useState } from "react";
// 使用 framer-motion 代替 motion/react 以确保兼容性
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Presentation,
    Share2,
    X,
    Edit,
    Play // 引入播放图标
} from "lucide-react";
import type {SlideData} from "../../../../../../api/entity/vo/SlideData.ts";
import {usePPTXInfo} from "../../../../../store/usePPTXInfo.tsx";
import {CssVariableNames} from "../../../../../../lib";

// 缩略图参数配置
const THUMB_WIDTH = 200;
const VIRTUAL_WIDTH = 1024;
const SCALE = THUMB_WIDTH / VIRTUAL_WIDTH;
const VIRTUAL_HEIGHT = VIRTUAL_WIDTH * (10/16); // 16:10 比例

export const PptxPreviewContainer = () => {
    // 编辑界面显示状态
    const [isEditing, setIsEditing] = useState(false);
    // 全屏播放状态
    const [isFullScreen, setIsFullScreen] = useState(false);

    const {
        isOpen,
        getPPTTitle,
        closePPTXPreviewContainer,
        getPPTSlideDataList,
        getPPTSlideDataByCurrentPageNumber,
        isFirstPage,
        isLastPage,
        currentPageIsEqualIndex,
        prevPage,
        nextPage,
        setPage,
        getCurrentPageProgressInSlideDataList
    } = usePPTXInfo();

    // 键盘快捷键监听
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                if (isFullScreen && isLastPage?.()) {
                    setIsFullScreen(false);
                } else {
                    nextPage?.();
                }
            }
            if (e.key === 'ArrowLeft') prevPage?.();
            if (e.key === 'Escape') {
                if (isFullScreen) {
                    setIsFullScreen(false);
                } else if (isEditing) {
                    setIsEditing(false);
                } else {
                    closePPTXPreviewContainer?.();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPage, prevPage, closePPTXPreviewContainer, isEditing, isFullScreen, isLastPage]);

    if (!isOpen?.()) return <></>;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2026] flex items-center justify-center">
                {/* 背景遮罩 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={closePPTXPreviewContainer}
                />

                {/* PPT 预览主面板 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative z-[2026]
                                max-lg:min-w-[75vw] max-lg:w-[75vw] max-lg:max-w-[75vw]
                                lg:min-w-[75vw] lg:w-[52vw] lg:max-w-[75vw]
                                xl:min-w-[75vw] xl:w-[75vw] xl:max-w-[75vw]
                                2xl:min-w-[75vw] 2xl:w-[75vw] 2xl:max-w-[75vw] max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-white"
                >
                    {/* 顶部工具栏 */}
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center shadow-md">
                                <Presentation size={16}/>
                            </div>
                            <span className="font-medium truncate max-w-[40vw]">{getPPTTitle?.()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* 播放按钮 */}
                            <button
                                onClick={() => setIsFullScreen(true)}
                                className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-1 group text-emerald-400"
                                title="全屏播放"
                            >
                                <Play size={18} fill="currentColor" />
                            </button>
                            {/* 编辑按钮 */}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-1 group"
                                title="编辑内容"
                            >
                                <Edit size={18} className="group-hover:text-orange-400 transition-colors"/>
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-all"><Share2 size={18}/></button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-all"><Download size={18}/></button>
                            <div className="w-px h-4 bg-white/20 mx-1"/>
                            <button
                                onClick={closePPTXPreviewContainer}
                                className="p-2 hover:bg-red-500 rounded-full transition-all"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                    </div>

                    {/* 主体内容区：左侧预览，右侧列表 */}
                    <div className="flex-1 flex overflow-hidden relative">
                        {/* 左侧：主幻灯片展示区 */}
                        <div className="flex-1 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden relative">
                                <iframe
                                    srcDoc={getPPTSlideDataByCurrentPageNumber?.()?.htmlContent}
                                    className="w-full h-full border-0"
                                    title="main-slide"
                                />

                                {/* 翻页控制按钮组 */}
                                <div
                                    className="absolute inset-y-0 left-0 w-24 flex items-center justify-center group/nav z-20">
                                    <button
                                        onClick={() => prevPage?.()}
                                        disabled={isFirstPage?.()}
                                        className="p-3 bg-white/80 hover:bg-white rounded-full shadow-md text-slate-800 disabled:opacity-0 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <ChevronLeft size={24}/>
                                    </button>
                                </div>

                                <div
                                    className="absolute inset-y-0 right-0 w-24 flex items-center justify-center group/nav z-20">
                                    <button
                                        onClick={() => nextPage?.()}
                                        disabled={isLastPage?.()}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md disabled:opacity-0 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <ChevronRight size={24}/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 中间：进度条指示器 */}
                        <div className="w-1 bg-slate-200 relative flex-shrink-0">
                            <div
                                className="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-500"
                                style={{height: `${(getCurrentPageProgressInSlideDataList?.() || 0) * 100}%`}}
                            />
                        </div>

                        {/* 右侧：缩略图列表栏 */}
                        <div
                            className="w-[260px] bg-slate-50 flex flex-col border-l border-slate-200 overflow-y-auto p-4 gap-4 scroll-smooth custom-scrollbar">
                            {getPPTSlideDataList?.().map((slideData: SlideData, i: number) => {
                                const isSelected = currentPageIsEqualIndex?.(i);
                                const pageTitle = slideData?.title || `第 ${i + 1} 页`;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => setPage?.(i)}
                                        onDoubleClick={() => {
                                            setPage?.(i);
                                            setIsFullScreen(true);
                                        }}
                                        title={pageTitle}
                                        className={`flex-shrink-0 w-full rounded-xl border-2 transition-all cursor-pointer flex flex-col bg-white overflow-hidden shadow-sm ${
                                            isSelected ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300'
                                        }`}
                                    >
                                        {/* 1. 缩略图预览：固定 16:10 且使用 Scale 渲染 */}
                                        <div className="w-full aspect-[16/10] bg-white overflow-hidden relative border-b border-slate-100">
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <iframe
                                                    srcDoc={slideData?.htmlContent}
                                                    title={`thumb-${i}`}
                                                    sandbox="allow-scripts"
                                                    style={{
                                                        width: `${VIRTUAL_WIDTH}px`,
                                                        height: `${VIRTUAL_HEIGHT}px`,
                                                        border: 'none',
                                                        pointerEvents: 'none',
                                                        transform: `scale(${SCALE * (228/THUMB_WIDTH)})`, // 根据右侧栏宽度微调缩放
                                                        transformOrigin: 'top left',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0
                                                    }}
                                                />
                                                {/* 透明遮罩确保点击事件冒泡到父级容器 */}
                                                <div className="absolute inset-0 z-10" />
                                            </div>
                                        </div>

                                        {/* 2. 标题显示区域：单行截断 + Hover提示 */}
                                        <div className="px-3 py-2 bg-white">
                                            <p className={`text-[12px] font-medium truncate ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                {i + 1}. {pageTitle}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 编辑 PPT 界面叠加层 */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className={`fixed inset-0 z-[50] bg-[${CssVariableNames.dashboardBackgroundColor}] flex flex-col shadow-2xl`}
                                >
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Edit size={18} className="text-indigo-600"/>
                                            <span className={`font-semibold text-[${CssVariableNames.dashboardForegroundColor}]`}>
                                                编辑内容 - {getPPTSlideDataByCurrentPageNumber?.()?.title || `第 ${getCurrentPageProgressInSlideDataList() * getPPTSlideDataList().length} 页`}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
                                        >
                                            <X size={20}/>
                                        </button>
                                    </div>
                                    <div className={`flex-1 p-6 overflow-y-auto bg-[${CssVariableNames.dashboardBackgroundColor}]`}>
                                        {/* 这里放置具体的编辑表单或编辑器组件 */}
                                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                            <h3 className="text-lg font-medium mb-4 text-slate-800">幻灯片编辑</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">页面标题</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={getPPTSlideDataByCurrentPageNumber?.()?.title}
                                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        placeholder="输入页面标题..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">内容编辑</label>
                                                    <textarea
                                                        rows={10}
                                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                                        placeholder="在此处编辑 HTML 或文本内容..."
                                                        defaultValue={getPPTSlideDataByCurrentPageNumber?.()?.htmlContent}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                                    >
                                                        取消
                                                    </button>
                                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                                                        保存更新
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 全屏播放叠加层 */}
                        <AnimatePresence>
                            {isFullScreen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[3000] bg-black flex items-center justify-center group/player"
                                >
                                    <iframe
                                        srcDoc={getPPTSlideDataByCurrentPageNumber?.()?.htmlContent}
                                        className="w-full h-full border-0 select-none"
                                        title="fullscreen-slide"
                                    />

                                    {/* 全屏翻页控制（悬停显示） */}
                                    <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-center group/nav-fs z-[3001]">
                                        <button
                                            onClick={() => prevPage?.()}
                                            disabled={isFirstPage?.()}
                                            className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full disabled:hidden opacity-0 group-hover/nav-fs:opacity-100 transition-all"
                                        >
                                            <ChevronLeft size={48} />
                                        </button>
                                    </div>

                                    <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-center group/nav-fs z-[3001]">
                                        <button
                                            onClick={() => {
                                                if (isLastPage?.()) {
                                                    setIsFullScreen(false);
                                                } else {
                                                    nextPage?.();
                                                }
                                            }}
                                            className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full opacity-0 group-hover/nav-fs:opacity-100 transition-all"
                                        >
                                            <ChevronRight size={48} />
                                        </button>
                                    </div>

                                    {/* 页码指示器（底部） */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 text-white/50 text-sm rounded-full opacity-0 group-hover/player:opacity-100 transition-opacity">
                                        {(getPPTSlideDataList()?.findIndex((_: any, i: number) => currentPageIsEqualIndex?.(i)) ?? 0) + 1} / {getPPTSlideDataList()?.length}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
