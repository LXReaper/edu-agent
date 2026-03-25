import {CssVariableNames, themeConfig} from "../../../lib";
import {AsideTransition, GlobalRouterPath, siteConfig} from "../../../constants";
import React, {useState} from "react";
import {motion} from "motion/react";
import {
    Bookmark,
    ChevronDown, ChevronUp,
    Command, Github,
    Heading, Instagram, NotebookText,
    PanelLeftClose,
    PanelLeftOpen,
    Plus, Twitter
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../home/ui/toolTip.tsx";
import {Wechat} from "@icon-park/react";
import {debounce, debounceX} from "../../../utils/debounceThrottle.ts";
import {useAllChatSessionStore} from "../../store/useAllChatSessionStore.tsx";
import type {ChatSessionConfig} from "../../../api/entity/models/ChatSessionConfig.ts";
import {useCurChatSessionMessagesStore} from "../../store/useCurChatSessionMessagesStore.tsx";
import {useCurReportStepsInfoStore} from "../../store/useCurReportStepsInfoStore.tsx";

interface LeftAsideContainerProps {
    leftAsideIsExpand: boolean;
    setLeftAsideIsExpand: (leftAsideIsExpand: boolean) => void;

    setShowReport: (isShow: boolean) => void;
}

const asideWidth = themeConfig.themes.dark.variables[CssVariableNames.dashboardLeftAsideWidth];
const sidebarVariants = {
    hidden: {
        x: -Number(asideWidth.substring(0, asideWidth.length - 2)),
        width: 0,
        transition: {
            ...AsideTransition,
            duration: 0.5,
            when: "afterChildren",
        }
    },
    visible: {
        x: 0,
        width: Number(asideWidth.substring(0, asideWidth.length - 2)),
        transition: {
            ...AsideTransition,
            delayChildren: 0.1,
            staggerChildren: 0.05,
        }
    }
};
export const LeftAsideContainer: React.FC<LeftAsideContainerProps> = ({
    leftAsideIsExpand,
    setLeftAsideIsExpand,

    setShowReport,
}) => {
    const qrcodeForWechatOffice = import.meta.env.VITE_QRCODE_FOR_WECHAT_OFFICE;

    const {clearStepsContainer} = useCurReportStepsInfoStore();
    const {getChatSessionInfoList, getCurSelectChatSessionId, selectCurSelectChatSessionId} = useAllChatSessionStore();
    const {initMessageContainerList, clearMessageContainerList} = useCurChatSessionMessagesStore();
    const [clearDebounceTimeoutFunc, debounceFunc] = debounceX(() => setLeftAsideIsExpand(false), 800);

    const [isListHistory, setIsListHistory] = useState(false);
    const [isListCollect, setIsListCollect] = useState(false);
    const navigate = useNavigate();

    enum ListEnum {
        CHAT_HISTORY = "chat_history",
        COLLECTS_CHAT_HISTORY = "collects_chat_history",
    }
    const listContent = [
        {
            id: ListEnum.CHAT_HISTORY,
            icon: <NotebookText />,
            navName: "Chat History",
            emptyContent: "No chat history",
            content: getChatSessionInfoList(),
            isList: isListHistory,
            onClick: () => {
                setIsListHistory(!isListHistory)
            },
        },
        {
            id: ListEnum.COLLECTS_CHAT_HISTORY,
            icon: <Bookmark />,
            navName: "Collects",
            emptyContent: "No chat history",
            content: [],
            isList: isListCollect,
            onClick: () => {
                setIsListCollect(!isListCollect)
            },
        },
    ];

    const navigateTo = (url: string, target = "_blank") => {
        window.open(url, target);
    };

    const selectChatSessionId = (chatSessionId: string) => {
        if (chatSessionId && chatSessionId !== getCurSelectChatSessionId()) {
            const selectSuccess = selectCurSelectChatSessionId(chatSessionId);
            if (selectSuccess) {
                setShowReport(false);
                clearStepsContainer();
                clearMessageContainerList();
                // initMessageContainerList(chatSessionId);
                navigateTo(GlobalRouterPath.DASHBOARD + "/" + chatSessionId, "_self");
            }
        }
    }
    const selectChatSessionIdDebounce = debounce(selectChatSessionId, 200);

    return (
        <motion.aside
            variants={sidebarVariants}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
            onMouseLeave={debounceFunc}
            onMouseEnter={clearDebounceTimeoutFunc}
            className={`fixed bottom-0 left-0 top-0 z-[120] h-[100vh] lg:static
                bg-[${CssVariableNames.leftAsideBackgroundColor}] text-[${CssVariableNames.leftAsideForegroundColor}]`}>
            <div
                className={`flex h-full w-full min-w-[${CssVariableNames.dashboardLeftAsideWidth}] flex-1 flex-col justify-between`}>
                {/*header box*/}
                <div className="h-[60px] items-center justify-between px-4 flex">
                    <div className={`select-none flex items-center gap-[5px] cursor-pointer`}
                         onClick={() => navigate(GlobalRouterPath.HOME)}>
                        <img className={`pointer-events-none`} height={36} width={36} src={siteConfig.logo}/>
                        <img className={`pointer-events-none`} height={96} width={96}
                             src={themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? siteConfig.webBlackNameLogo : siteConfig.webWhiteNameLogo}/>
                    </div>
                    <div className={`flex cursor-pointer rounded-[5px] p-1 hover:bg-[#25262c]/[0.5]`} onClick={() => setLeftAsideIsExpand(!leftAsideIsExpand)}>
                        {leftAsideIsExpand && <PanelLeftClose />}
                        {!leftAsideIsExpand && <PanelLeftOpen />}
                    </div>
                </div>
                {/*content box*/}
                <div className={`w-full flex-1 flex-col justify-between flex`}>
                    <div className={`flex-1 overflow-y-auto px-4`}>
                        {/*new chat*/}
                        <div className={`bg-[#5d9cf1]/[0.06] hover:bg-[#5d9cf1]/[0.12] active:bg-[#5d9cf1]/[0.18] mb-[6px] hidden h-10 cursor-pointer 
                            items-center justify-between rounded-[12px] border-[0.5px] border-[#3DAEFF29] pl-3 pr-4 md:flex`}>
                            <div className={`flex items-center text-[#5d9cf1] justify-start gap-2`}>
                                <div className={`h-5 w-5 flex items-center justify-center`}><Plus /></div>
                                <div className={`whitespace-nowrap text-[15px] font-[500]`}>New Chat</div>
                            </div>
                            <div className={`hidden text-[#5d9cf1] items-center justify-start gap-[5px] opacity-[0.40] md:flex`}>
                                <Command width={16} height={16} />
                                <Heading width={16} height={16} />
                            </div>
                        </div>
                        {/*chat info*/}
                        <div className={`mb-[6px] flex min-h-[42px] flex-col overflow-hidden`}>
                            {listContent.map((list, index) =>
                                <div key={index}>
                                    <nav
                                        className={`hover:bg-[#252731]/[0.5] mb-[2px] flex h-10 w-full flex-shrink-0 cursor-pointer items-center rounded-[12px]`}
                                        onClick={list.onClick}>
                                        <div className={`flex w-full min-w-[calc(${CssVariableNames.dashboardLeftAsideWidth} - 56px)]
                                            items-center justify-between md:px-3`}>
                                            <div className={`flex gap-2`}>
                                                {list.icon}
                                                <div className={`text-col_text00 text-[15px] font-[500]`}>{list.navName}</div>
                                            </div>
                                            <div className={`transition duration-300`}>
                                                {!list.isList && <ChevronDown />}
                                                {list.isList && <ChevronUp />}
                                            </div>
                                        </div>
                                    </nav>
                                    {list.isList && <div className={``}>
                                        {list.content.length <= 0 && <div
                                            className={`flex h-[36px] items-center justify-center overflow-hidden pl-[10px] text-[#6b6b6f] text-[14px]`}>
                                            {list.emptyContent}
                                        </div>}
                                        {list.content.length > 0 && list.id === ListEnum.CHAT_HISTORY &&
                                            list.content.map((chatSessionConfig: ChatSessionConfig, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => selectChatSessionIdDebounce(chatSessionConfig.id)}
                                                    className={`hover:bg-[#252731]/[0.2] active:bg-[#252731]/[0.3] px-3
                                                        ${getCurSelectChatSessionId() === chatSessionConfig.id ? "bg-[#252731]/[0.3]" : ""}
                                                        mb-[2px] flex h-10 w-full flex-shrink-0 cursor-pointer items-center rounded-[12px]`}>
                                                    {chatSessionConfig?.title ?? ""}
                                                </div>
                                            ))
                                        }
                                    </div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*footer content*/}
                <div className={`flex flex-col items-center px-4 pb-1`}>
                    <div className={`flex w-full items-center justify-around py-[9px]`}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`p-2`}><Twitter className={`cursor-pointer`} onClick={() => navigateTo(siteConfig.links.twitter)} /></div>
                                </TooltipTrigger>
                                <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                    <p>Twitter</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`p-2`}><Github className={`cursor-pointer`} onClick={() => navigateTo(siteConfig.links.github)} /></div>
                                </TooltipTrigger>
                                <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                    <p>GitHub repository</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`p-2`}><Wechat size={24} className={`cursor-pointer`}/></div>
                                </TooltipTrigger>
                                <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                    <div className={`flex flex-col items-center justify-center select-none pointer-events-none`}>
                                        <img height={144} width={144} src={qrcodeForWechatOffice} />
                                        <div className={`select-auto`}>微信公众号</div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`p-2`}><Instagram className={`cursor-pointer`} onClick={() => navigateTo(siteConfig.links.instagram)} /></div>
                                </TooltipTrigger>
                                <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                    <p>Instagram</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div
                        onClick={() => navigate(GlobalRouterPath.ABOUT)}
                        className={`text-[#909092] mt-[16px] text-[11px] font-[300] hover:underline cursor-pointer`}>
                        About {siteConfig.name}
                    </div>
                </div>
            </div>
        </motion.aside>
    )
}
