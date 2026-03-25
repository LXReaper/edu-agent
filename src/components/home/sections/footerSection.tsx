import {CssVariableNames, themeConfig} from "../../../lib";
import {siteConfig} from "../../../constants";
import {Github, Instagram, Twitter} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../ui/toolTip.tsx";
import React from "react";
import {useNavigate} from "react-router-dom";
import {Wechat} from "@icon-park/react";

export const FooterSection = () => {
    const qrcodeForWechatOffice = import.meta.env.VITE_QRCODE_FOR_WECHAT_OFFICE;

    const navigate = useNavigate();
    const navigateTo = (url: string) => {
        window.open(url, "_blank");
    };
    return (
        <footer>
            <div className={`w-[100vw] h-[45vh] px-[4.875rem] flex py-[5%]
                text-xs bg-[${CssVariableNames.footerBackgroundColor}] lg:px-[4.875rem]`}>
                <div className={`w-[10vw]`}></div>
                <div className={`flex md:flex-1 max-md:flex-wrap justify-between`}>
                    <div className={`flex flex-col gap-[20px]`}>
                        <div className={`pointer-events-none select-none flex items-center`}>
                            <img height={144} width={144}
                                 src={themeConfig.currentTheme.includes(themeConfig.themes.light.id) ? siteConfig.webWhiteNameLogo : siteConfig.webWhiteNameLogo} />
                        </div>
                        <div className={`flex gap-[2rem] text-[${CssVariableNames.footerForegroundColor}]`}>
                            <TooltipProvider>
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
                                        <div className={`p-2`}><Github className={`cursor-pointer`} onClick={() => navigateTo(siteConfig.links.github)} /></div>
                                    </TooltipTrigger>
                                    <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                        <p>GitHub repository</p>
                                    </TooltipContent>
                                </Tooltip>
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
                                        <div className={`p-2`}><Instagram className={`cursor-pointer`} onClick={() => navigateTo(siteConfig.links.instagram)} /></div>
                                    </TooltipTrigger>
                                    <TooltipContent className={`text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}]`} side="top" direction="bottom">
                                        <p>Instagram</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className={`flex text-[${CssVariableNames.footerForegroundColor}] gap-[20px]`}>
                        <div className={`flex flex-col gap-[15px]`}>
                            <div className={`text-[16px] font-[500] leading-normal`}>Brand</div>
                            <div className={`text-[12px] leading-normal cursor-pointer`} onClick={() => navigate("/about")}>About</div>
                            <div className={`text-[12px] leading-normal cursor-pointer`} onClick={() => navigate("/blog")}>Blog</div>
                            <div className={`text-[12px] leading-normal cursor-pointer`} onClick={() => navigate("/price")}>Pricing</div>
                        </div>
                        <div className={`flex flex-col gap-[15px]`}>
                            <div className={`text-[16px] font-[500] leading-normal`}>Brand</div>
                            <div className={`text-[12px] leading-normal`}>About</div>
                        </div>
                    </div>
                </div>
                <div className={`w-[10vw]`}></div>
            </div>
        </footer>
    )
}
