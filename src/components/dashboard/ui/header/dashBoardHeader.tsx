import {CssVariableNames, LocalStorageKeys, themeConfig} from "../../../../lib";
import {Check, LaptopMinimal, Moon, PanelLeftOpen, Sun} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../../home/ui/toolTip.tsx";
import {useBasicConfigStore} from "../../../store/useBasicConfigStore.tsx";
import {applyTheme} from "../../../../utils";

interface DashBoardHeaderProps {
    leftAsideIsExpand: boolean;
    setLeftAsideIsExpand: (leftAsideIsExpand: boolean) => void;

    setLoginModelIsOpen: (loginModelIsOpen: boolean) => void;
}
export const DashBoardHeader: React.FC<DashBoardHeaderProps> = ({
    leftAsideIsExpand,
    setLeftAsideIsExpand,
    setLoginModelIsOpen,
}) => {
    const {setStyleVariable} = useBasicConfigStore();

    const changeTheme = (newTheme: string) => {
        themeConfig.currentTheme = newTheme;// 修改当前主题
        localStorage.setItem(LocalStorageKeys.currentTheme, themeConfig.currentTheme);

        applyTheme(setStyleVariable);
    }

    return (
        <header className={`z-[110] h-[54px] w-[100vw] overflow-hidden md:h-[60px]`}>
            <div
                className={`h-full w-full flex items-center justify-between flex-1 bg-transparent pl-[8px] pr-[20px] shadow-none`}>
                {/*left column of header*/}
                <div className={`flex items-center`}>
                    {!leftAsideIsExpand &&
                        <div className={`flex cursor-pointer rounded-[5px] p-3 hover:bg-[#25262c]/[0.5] text-[${CssVariableNames.leftAsideForegroundColor}]`}
                             onClick={() => setLeftAsideIsExpand(!leftAsideIsExpand)}>
                            <PanelLeftOpen />
                        </div>
                    }
                </div>
                {/*right column of header*/}
                <div className={`flex items-center gap-4`}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={`hover:bg-[#25262c] flex h-[32px] w-[32px] cursor-pointer text-[${CssVariableNames.foregroundColor}] 
                                        hover:text-[${CssVariableNames.backgroundColor}] py-[1px] px-0 items-center justify-center rounded-[8px]`}>
                                        {themeConfig.currentTheme.includes(themeConfig.themes.light.id) &&
                                            <Sun className="h-[1.2rem] w-[1.2rem] flex justify-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />}
                                        {themeConfig.currentTheme.includes(themeConfig.themes.dark.id) &&
                                            <Moon className="h-[1.2rem] w-[1.2rem] flex justify-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className={`bg-[${CssVariableNames.dashBoardTextBoardColor}] text-[${CssVariableNames.dashboardForegroundColor}]
                                border border-[${themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "#eee" : "#333"}]
                                ${
                                    themeConfig.currentTheme.includes(themeConfig.themes.light.id)
                                        ? "shadow-[1px_5px_8px_rgba(0,0,0,0.1)]"
                                        : "shadow-[1px_5px_8px_rgba(0,0,0,0.5)]"
                                }`}
                                style={{padding: 0}} direction='top' isShowArrow={false}
                            >
                                <div className={`w-[12vw] p-2 flex flex-col gap-[3px] rounded-full`}>
                                    <div className={`${themeConfig.currentTheme.includes(themeConfig.userSuffix) && themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? "bg-[#aaa]" : ""}
                                         hover:bg-[#aaa]/[0.69] active:bg-[#aaa] h-[4vh] rounded-[7px] justify-between flex-1 flex items-center p-3 cursor-pointer select-none`}
                                         onClick={() => changeTheme(themeConfig.themes.light.id + themeConfig.userSuffix)}
                                    >
                                        <div className={`gap-[0.5rem] flex`}>
                                            <Sun
                                                className="h-[1.2rem] w-[1.2rem] flex justify-center items-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary"/>
                                            <div>Light Mode</div>
                                        </div>
                                        {themeConfig.currentTheme.includes(themeConfig.userSuffix) && themeConfig.currentTheme.includes(themeConfig.themes.light.id) &&
                                            <div className={`flex justify-center items-center`}><Check height={20} width={20} /></div>}
                                    </div>
                                    <div className={`${themeConfig.currentTheme.includes(themeConfig.userSuffix) && themeConfig.currentTheme.includes(themeConfig.themes.dark.id) ? "bg-[#aaa]" : ""}
                                         hover:bg-[#aaa]/[0.69] active:bg-[#aaa] h-[4vh] rounded-[7px] justify-between flex-1 flex items-center p-3 cursor-pointer select-none`}
                                         onClick={() => changeTheme(themeConfig.themes.dark.id + themeConfig.userSuffix)}
                                    >
                                        <div className={`gap-[0.5rem] flex`}>
                                            <Moon
                                                className="h-[1.2rem] w-[1.2rem] flex justify-center items-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary"/>
                                            <div>Dark Mode</div>
                                        </div>
                                        {themeConfig.currentTheme.includes(themeConfig.userSuffix) && themeConfig.currentTheme.includes(themeConfig.themes.dark.id) &&
                                            <div className={`flex justify-center items-center`}><Check height={20} width={20} /></div>}
                                    </div>
                                    <div className={`${themeConfig.currentTheme.includes(themeConfig.systemSuffix) ? "bg-[#aaa]" : ""}
                                         hover:bg-[#aaa]/[0.69] active:bg-[#aaa] h-[4vh] rounded-[7px] justify-between flex-1 flex items-center p-3 cursor-pointer select-none`}
                                         onClick={() => changeTheme((() => {
                                             const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                             return (isDarkMode ? themeConfig.themes.dark.id : themeConfig.themes.light.id) + themeConfig.systemSuffix;
                                         })())}
                                    >
                                        <div className={`gap-[0.5rem] flex`}>
                                            <LaptopMinimal
                                                className="h-[1.2rem] w-[1.2rem] flex justify-center items-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary"/>
                                            <div>System Mode</div>
                                        </div>
                                        {themeConfig.currentTheme.includes(themeConfig.systemSuffix) && <div className={`flex justify-center items-center`}><Check height={20} width={20} /></div>}
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className={`flex h-[32px] cursor-pointer items-center justify-center rounded-full select-none px-[16px]
                        border-[${CssVariableNames.borderColor}] hover:text-[${CssVariableNames.backgroundColor}] text-[13px] border
                        text-[${CssVariableNames.foregroundColor}] hover:bg-[${CssVariableNames.foregroundColor}]`}
                        onClick={() => setLoginModelIsOpen(true)}
                    >
                        Sign In
                    </div>
                </div>
            </div>
        </header>
    )
}
