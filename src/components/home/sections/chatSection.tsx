import {FadeInUpVariant, LiquidTitle, siteConfig} from "../../../constants";
import {CssVariableNames} from "../../../lib";
import {Rocket} from "lucide-react";
import {FileUploadHandler} from "../ui/chatInput/fileUploadHandler.tsx";
import {ChatExample} from "../ui/chatInput/chatExample.tsx";
import {useEffect, useRef, useState} from "react";
import {useIsMobile} from "../../../hooks/useIsMobile.tsx";
import {Textarea} from "../ui/basic/Textarea.tsx";
import {motion} from "motion/react";

export const ChatSection = () => {
    const isMobile = useIsMobile();
    const textareaRef = useRef(null);

    const [inputValue, setInputValue] = useState("");

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);
    return (
        <div className="relative z-20 flex flex-col items-center justify-center">
            <motion.div
                variants={LiquidTitle}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true}} // 仅触发一次
                transition={{duration: 1, delay: 0.3}} // 动画时长
                className={`flex flex-col items-center justify-center gap-3 sm:gap-4 pt-8 max-md:max-w-[80vw]
                    sm:pt-12 md:max-w-[55vw] mx-auto text-[${CssVariableNames.foregroundColor}]`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium flex-wrap whitespace-nowrap
                    flex items-center justify-center tracking-tighter text-balance text-center px-2">
                    <span className={`inline-flex`}>Use {siteConfig.name} for&nbsp;</span>
                    <span
                        className={`inline-flex transition-opacity duration-300 opacity-100 text-[${CssVariableNames.technologyButtonColor}]`}>
                        Lesson Plan Design
                    </span>
                </h1>
                <p className="text-[#888889] md:text-lg text-center font-black font-medium text-balance leading-relaxed tracking-tight max-w-2xl px-2">
                    AI Workers that run your work autonomously.
                </p>
            </motion.div>
            <motion.div
                variants={FadeInUpVariant}
                initial={{opacity: 0, y: 50}}  // 初始状态透明且下移50px
                whileInView={{opacity: 1, y: 0}} // 进入视口时变为不透明并回到原位置
                viewport={{once: true}} // 仅触发一次
                transition={{duration: 1, delay: 0.5}} // 动画时长
                className={`flex flex-col items-center w-full max-w-3xl mx-auto gap-2 flex-wrap justify-center px-2 sm:px-0`}>
                {/*输入框*/}
                <div className={`w-full relative z-10 mx-auto w-full max-w-4xl`}>
                    <div
                        className={`color-[${CssVariableNames.cardForegroundColor}] flex flex-col gap-6 border py-6 -mb-2
                            shadow-none w-full max-w-4xl mx-auto bg-[${CssVariableNames.backgroundColor}] border-none overflow-visible rounded-3xl relative z-10`}>
                        <div className={`w-full text-sm flex flex-col justify-between items-start rounded-lg`}>
                            <div className={`w-full p-1.5 pb-2 bg-card border rounded-3xl`}>
                                <div className={`opacity: 1; height: auto;`}>
                                    <div className="flex flex-wrap gap-3">
                                        {/*<div className="relative group h-[54px]">*/}
                                        {/*    <button*/}
                                        {/*        className="group relative min-h-[54px] rounded-2xl cursor-pointer border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 p-0 overflow-hidden items-center justify-center inline-block"*/}
                                        {/*        title="IMG_1752924941209.png"*/}
                                        {/*        style={{maxWidth: "100%", height: "auto"}}>*/}
                                        {/*        <img alt="IMG_1752924941209.png"*/}
                                        {/*             className="max-h-full max-w-full w-auto"*/}
                                        {/*             src="/images/hero_section_post.png"*/}
                                        {/*             style={{*/}
                                        {/*                 height: "54px",*/}
                                        {/*                 objectPosition: "center center",*/}
                                        {/*                 objectFit: "contain"*/}
                                        {/*             }}/>*/}
                                        {/*    </button>*/}
                                        {/*    <div*/}
                                        {/*        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black dark:bg-white border-3 border-sidebar text-white dark:text-black flex items-center justify-center z-30 cursor-pointer">*/}
                                        {/*        <div className="flex items-center justify-center w-full h-full"*/}
                                        {/*             data-state="closed" data-slot="tooltip-trigger">*/}
                                        {/*            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"*/}
                                        {/*                 viewBox="0 0 24 24" fill="none" stroke="currentColor"*/}
                                        {/*                 stroke-width="3" stroke-linecap="round" stroke-linejoin="round"*/}
                                        {/*                 className="lucide lucide-x">*/}
                                        {/*                <path d="M18 6 6 18"></path>*/}
                                        {/*                <path d="m6 6 12 12"></path>*/}
                                        {/*            </svg>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                    </div>
                                </div>
                                <div className={`relative flex flex-col w-full h-full gap-2 justify-between`}>
                                    {/*输入框主要组件块*/}
                                    <Textarea
                                        ref={textareaRef}
                                        className={`resize-none min-h-[36px] max-h-[200px] bg-[${CssVariableNames.backgroundColor}]`}
                                        value={inputValue}
                                        setInputValue={setInputValue}
                                        onChange={(event) => {
                                            adjustTextareaHeight();
                                            setInputValue(event.target.value);
                                        }} />
                                    {/*下方操作栏*/}
                                    <div className={`flex items-center justify-between mt-0 mb-1 px-2`}>
                                        {/*左侧操作栏*/}
                                        <div className={`flex items-center gap-3`}>
                                            <FileUploadHandler/>
                                        </div>
                                        {/*右侧操作栏*/}
                                        <div className={`flex items-center gap-2`}>
                                            <button className={`flex items-center gap-1.5 h-8 px-2 rounded-xl
                                                text-[${CssVariableNames.foregroundColor}] hover:bg-[${CssVariableNames.buttonHoverColor}]`}>
                                                <div className={`flex items-center gap-2 min-w-0 max-w-[180px]`}>
                                                    <img
                                                        className={`select-none pointer-events-none text-transparent w-[20px] h-[20px] min-w-[20px] min-h-[20px]`}
                                                        src={siteConfig.logo}/>
                                                    <span
                                                        className={`truncate text-sm font-medium`}>{siteConfig.name}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                         className="lucide lucide-chevron-down opacity-60 flex-shrink-0">
                                                        <path d="m6 9 6 6 6-6"></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            <button className={`flex items-center gap-1.5 h-8 px-2 rounded-xl
                                                text-[${CssVariableNames.foregroundColor}] hover:bg-[${CssVariableNames.buttonHoverColor}]`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                     className="lucide lucide-mic h-4 w-4">
                                                    <path
                                                        d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                                    <line x1="12" x2="12" y1="19" y2="22"></line>
                                                </svg>
                                            </button>
                                            <button className={`flex items-center gap-1.5 h-8 px-2 rounded-full
                                                text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.okButtonColor}]`}>
                                                <Rocket height={20} width={20}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={FadeInUpVariant}
                initial={{opacity: 0, y: 50}}  // 初始状态透明且下移50px
                whileInView={{opacity: 1, y: 0}} // 进入视口时变为不透明并回到原位置
                viewport={{once: true}} // 仅触发一次
                transition={{duration: 1, delay: 0.7}} // 动画时长
                className="w-full pt-2"
            >
                <ChatExample onSelectPrompt={setInputValue} count={isMobile ? 2 : 4} />
            </motion.div>
        </div>
    )
}
