import {useChatSessionSearchStore} from "../../../../../store/useChatSessionSearchStore.tsx";
import {ChevronRight, Clock, Command, Eye, EyeOff, MessageSquare, Search, Sparkles, X, Edit2, Trash2, Check} from "lucide-react";
import React, {useEffect, useState, useRef} from "react";
import {CssVariableNames, themeConfig} from "../../../../../../lib";
import {motion} from "motion/react";
import {useAllChatSessionStore} from "../../../../../store/useAllChatSessionStore.tsx";
import moment from "moment";
import {GlobalRouterPath} from "../../../../../../constants";
import {debounce, throttle_} from "../../../../../../utils/debounceThrottle.ts";
import {ChatSessionController} from "../../../../../../api/ChatSessionController.ts";

const containerAnimation = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
            when: "beforeChildren",
            staggerChildren: 0.15
        }
    }
};

export const ChatSessionSearchContainer = () => {
    const {isOpen, close, searchChatSessionInfoList, searchMoreChatSessionInfoList, editChatSessionTitle, deleteChatSession, clearChatSessionSearchInfo} = useChatSessionSearchStore();
    const {selectCurSelectChatSessionId, queryChatSessionInfoList} = useAllChatSessionStore();

    const sessionLength = useAllChatSessionStore((state) => state.getChatSessionInfoLength());
    const sessionList = useAllChatSessionStore((state) => state.getChatSessionInfoList());
    const searchSessionList = useChatSessionSearchStore(state => state.getChatSessionSearchInfoList());
    const searchSessionLength = useChatSessionSearchStore(state => state.getChatSessionSearchInfoListLength());

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreviews, setShowPreviews] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>();

    // 编辑/删除状态管理
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 监听快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 滚动触底加载更多
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const threshold = 100;

        if (scrollHeight - scrollTop - clientHeight <= threshold) {
            if (!isLoading && hasMore) {
                setIsLoading(true);
                if (searchQuery)
                    searchMoreChatSessionInfoList(searchQuery, 0);
                else
                    queryChatSessionInfoList();
                setIsLoading(false);
            }
        }
    }

    const handleScrollThrottle_ = throttle_(handleScroll, 300);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        scrollContainer.addEventListener('scroll', handleScrollThrottle_);
        return () => scrollContainer.removeEventListener('scroll', handleScrollThrottle_);
    }, [handleScrollThrottle_]);

    const navigateTo = (url: string, target = "_blank") => {
        window.open(url, target);
    };

    const selectChatSessionId = (chatSessionId: string) => {
        if (chatSessionId) {
            const selectSuccess = selectCurSelectChatSessionId(chatSessionId);
            if (selectSuccess) {
                setIsSearchOpen(false);
                close();
                navigateTo(GlobalRouterPath.DASHBOARD + "/" + chatSessionId, "_self");
            }
        }
    }
    const selectChatSessionIdDebounce = debounce(selectChatSessionId, 200);

    const searchSession = (searchQuery: string) => {
        searchChatSessionInfoList(searchQuery, 0);
    }
    const searchSessionDebounce = debounce(searchSession, 500);

    // 编辑相关函数
    const handleEditClick = (sessionId: string, currentTitle: string) => {
        setEditingSessionId(sessionId);
        setEditingTitle(currentTitle);
        setDeletingSessionId(null); // 清除删除状态
    };

    const handleEditConfirm = async (sessionId: string) => {
        if (searchQuery) {
            editChatSessionTitle(sessionId, editingTitle);
        } else await ChatSessionController.updateChatSessionTitle(sessionId, editingTitle);
        console.log('确认编辑会话标题:', sessionId);
        queryChatSessionInfoList();
        // 更新成功后清空编辑状态
        setEditingSessionId(null);
        setEditingTitle('');
    };

    const handleEditCancel = () => {
        setEditingSessionId(null);
        setEditingTitle('');
    };

    // 删除相关函数
    const handleDeleteClick = (sessionId: string) => {
        setDeletingSessionId(sessionId);
        setEditingSessionId(null); // 清除编辑状态
    };

    const handleDeleteConfirm = async (sessionId: string) => {
        if (searchQuery) {
            deleteChatSession(sessionId);
        } else await ChatSessionController.deleteSession(sessionId);
        queryChatSessionInfoList();
        console.log('确认删除会话:', sessionId);
        // 删除成功后清空删除状态
        setDeletingSessionId(null);
    };

    const handleDeleteCancel = () => {
        setDeletingSessionId(null);
    };

    // 渲染操作按钮的通用函数
    const renderActionButtons = (session: any) => {
        // 编辑状态
        if (editingSessionId === session.id) {
            return (
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditConfirm(session.id);
                        }}
                        className="p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 transition-all duration-200"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditCancel();
                        }}
                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all duration-200"
                    >
                        <X size={14} />
                    </button>
                </div>
            );
        }

        // 删除状态
        if (deletingSessionId === session.id) {
            return (
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirm(session.id);
                        }}
                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all duration-200"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCancel();
                        }}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        <X size={14} />
                    </button>
                </div>
            );
        }

        // 正常状态 - 显示编辑和删除按钮
        return (
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(session.id, session.title);
                    }}
                    className={`p-1 rounded-md transition-all duration-200 ${
                        selectedSessionId === session.id
                            ? 'opacity-100 hover:bg-gray-500'
                            : 'opacity-0'
                    }`}
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(session.id);
                    }}
                    className={`p-1 rounded-md transition-all duration-200 ${
                        selectedSessionId === session.id
                            ? 'opacity-100 hover:bg-red-900/30 hover:text-red-600'
                            : 'opacity-0'
                    }`}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        );
    };

    const closeModel = () => {
        setEditingSessionId(null);
        setSearchQuery("");
        clearChatSessionSearchInfo();
        setIsSearchOpen(false);
        close();
    }

    if (!isOpen()) return <></>;

    return (
        <div className="fixed inset-0 z-2026 flex items-center justify-center p-4 md:p-6 lg:p-12">
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => closeModel()} />

            {/* 搜索面板 */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerAnimation}
                className={`relative h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden
                 border ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? `border-[#ddd] bg-[${CssVariableNames.dashboardBackgroundColor}]` : 'border-[#2f3336] bg-[#000000]'}
                 animate-in fade-in zoom-in duration-200 transition-all duration-500 ease-in-out ${showPreviews ? 'w-full max-w-5xl' : 'w-full max-w-xl'}`}>

                {/* 搜索输入栏 */}
                <div className={`flex items-center p-5 border-b border-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? '#ddd' : '#888'}] shrink-0`}>
                    <Search className={`text-[${CssVariableNames.dashboardForegroundColor}] mr-4`} size={24} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="搜索历史聊天..."
                        className={`flex-1 bg-transparent border-none focus:ring-0 text-[${CssVariableNames.dashboardForegroundColor}] text-xl outline-none`}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchSessionDebounce(e.target.value);
                        }}
                    />
                    <div className="flex items-center gap-4 text-gray-500">
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-[#2f3336] text-[10px] font-mono">
                            <Command size={10} /> K
                        </div>
                        <button onClick={() => closeModel()}
                                className={`p-1 hover:bg-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? '#ddd' : '#2f3336'}] rounded-full`}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* 内容区 */}
                <div className="flex-1 flex overflow-hidden">
                    {/* 左侧：搜索列表 */}
                    <div className={`transition-all duration-500 ease-in-out flex flex-col 
                        ${showPreviews ? `w-full md:w-[400px] border-r border-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? '#ddd' : '#2f3336'}]` : 'w-full'}`}>

                        {/* 滚动容器 */}
                        <div
                            ref={scrollContainerRef}
                            className={`flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar`}
                        >
                            {(!searchQuery ? sessionLength : searchSessionLength) > 0 && <div className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                                匹配到的对话 ({!searchQuery ? sessionLength : searchSessionLength})
                            </div>}
                            {!searchQuery && sessionLength > 0 ? (
                                <>
                                    {sessionList.map((session) => (
                                        <div
                                            key={session.id}
                                            onMouseEnter={() => !editingSessionId && !deletingSessionId && setSelectedSessionId(session.id)}
                                            onMouseLeave={() => setSelectedSessionId(null)}
                                            onClick={() => {
                                                // 编辑或删除状态下不触发跳转
                                                if (!editingSessionId && !deletingSessionId) {
                                                    selectChatSessionIdDebounce(session.id);
                                                }
                                            }}
                                            className={`px-4 cursor-pointer rounded-xl flex items-start gap-4 transition-all py-4 ${
                                                selectedSessionId === session.id && !editingSessionId && !deletingSessionId
                                                    ? `border ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? 'bg-[#efefef] border-[#ddd]' : 'bg-[#16181c] border-[#2f3336]'}`
                                                    : `hover:bg-[${CssVariableNames.dashboardBackgroundColor}] border border-transparent`
                                            }`}
                                        >
                                            <div className={`mt-1 shrink-0 ${selectedSessionId === session.id ? 'text-blue-400' : 'text-gray-600'}`}>
                                                <MessageSquare size={18} />
                                            </div>
                                            <div className={`flex-1 min-w-0 text-left text-[${CssVariableNames.dashboardForegroundColor}]`}>
                                                <div className="flex justify-between gap-2 items-center">
                                                    {editingSessionId === session.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingTitle}
                                                            onChange={(e) => setEditingTitle(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex-1 bg-transparent rounded text-[15px] font-medium outline-none"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <h4 className={`text-[15px] font-medium truncate`}>{session.title}</h4>
                                                    )}
                                                    {renderActionButtons(session)}
                                                </div>
                                                <div className="flex items-center gap-1 mt-2 text-[10px] font-medium">
                                                    <Clock size={10} />
                                                    {moment(session.updateTime).format("YYYY年MM月DD日")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 加载更多指示器 */}
                                    {isLoading && (
                                        <div className="flex justify-center items-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                                            <span className="ml-2 text-xs text-gray-500">加载更多...</span>
                                        </div>
                                    )}

                                    {/* 没有更多数据的提示 */}
                                    {!hasMore && sessionLength > 0 && (
                                        <div className="text-center py-4 text-xs text-gray-500">
                                            已经到底了 ~
                                        </div>
                                    )}
                                </>
                            ) : (searchQuery.length > 0 && searchSessionLength > 0 ?
                                (<>
                                    {searchSessionList.map((session) => (
                                        <div
                                            key={session.id}
                                            onMouseEnter={() => !editingSessionId && !deletingSessionId && setSelectedSessionId(session.id)}
                                            onMouseLeave={() => setSelectedSessionId(null)}
                                            onClick={() => {
                                                if (!editingSessionId && !deletingSessionId) {
                                                    selectChatSessionIdDebounce(session.id);
                                                }
                                            }}
                                            className={`px-4 cursor-pointer rounded-xl flex items-start gap-4 transition-all py-4 ${
                                                selectedSessionId === session.id && !editingSessionId && !deletingSessionId
                                                    ? `border ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? 'bg-[#efefef] border-[#ddd]' : 'bg-[#16181c] border-[#2f3336]'}`
                                                    : `hover:bg-[${CssVariableNames.dashboardBackgroundColor}] border border-transparent`
                                            }`}
                                        >
                                            <div className={`mt-1 shrink-0 ${selectedSessionId === session.id ? 'text-blue-400' : 'text-gray-600'}`}>
                                                <MessageSquare size={18} />
                                            </div>
                                            <div className={`flex-1 min-w-0 text-left text-[${CssVariableNames.dashboardForegroundColor}]`}>
                                                <div className="flex justify-between gap-2 items-center">
                                                    {editingSessionId === session.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingTitle}
                                                            onChange={(e) => setEditingTitle(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex-1 bg-transparent rounded text-[15px] font-medium outline-none"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <h4 className={`text-[15px] font-medium truncate`}>{session.title}</h4>
                                                    )}
                                                    {renderActionButtons(session)}
                                                </div>
                                                <div className="flex items-center gap-1 mt-2 text-[10px] font-medium">
                                                    <Clock size={10} />
                                                    {moment(session.updateTime).format("YYYY年MM月DD日")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 加载更多指示器 */}
                                    {isLoading && (
                                        <div className="flex justify-center items-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                                            <span className="ml-2 text-xs text-gray-500">加载更多...</span>
                                        </div>
                                    )}

                                    {/* 没有更多数据的提示 */}
                                    {!hasMore && searchSessionLength > 0 && (
                                        <div className="text-center py-4 text-xs text-gray-500">
                                            已经到底了 ~
                                        </div>
                                    )}
                                </>) :
                                (<div className={`flex flex-col items-center justify-center h-full text-[${CssVariableNames.dashboardForegroundColor}] text-center`}>
                                    <Sparkles color={`${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? '#2a3336' : '#efefef'}`} size={40} className={`mb-4 opacity-20`} />
                                    <p className="text-sm">未找到相关结果</p>
                                </div>)
                            )}
                        </div>

                        {/* 左下角控制栏 */}
                        <div className={`p-4 border-t ${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? `border-[#ddd] bg-[${CssVariableNames.dashboardBackgroundColor}]` : 'border-[#2f3336] bg-[#0d0f12]'}`}>
                            <button
                                onClick={() => setShowPreviews(!showPreviews)}
                                className={`flex items-center gap-2 text-gray-500
                                 hover:text-${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? 'gray-800' : '#fff'} transition-colors text-xs font-medium`}
                            >
                                {showPreviews ? (
                                    <>
                                        <EyeOff size={14} />
                                        <span>隐藏对话预览</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye size={14} />
                                        <span>显示对话预览</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
