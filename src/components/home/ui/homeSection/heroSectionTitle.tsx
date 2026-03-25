// --- 打字机 ---
import {useCallback, useEffect, useState} from "react";
import {motion} from "motion/react";
import {CssVariableNames} from "../../../../lib";
import {FadeInUpVariant, siteConfig} from "../../../../constants";

interface TypingConfig {
    typingSpeed: number;
    deletingSpeed: number;
    pauseTime: number;
}

const titles: string[] = [
    "智能 <span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400'>数字孪生体</span>",
    "自动化 <span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400'>教学工作流</span>",
    "构建 <span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400'>未来教学引擎</span>",
    "释放您的 <span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400'>无限潜能</span>",
];
const typingConfig: TypingConfig = {
    typingSpeed: 150,    // 打字速度，毫秒/字符
    deletingSpeed: 60,  // 删除速度，毫秒/字符
    pauseTime: 5000,    // 暂停时间，毫秒
};
const useTypingEffect = (texts: string[], config: TypingConfig) => {
    const [currentText, setCurrentText] = useState<string>('');
    const [titleIndex, setTitleIndex] = useState<number>(0);

    const type = useCallback((text: string, charIndex: number = 0) => {
        if (charIndex < text.length) {
            let nextCharIndex = charIndex;
            let charToAdd = text.charAt(charIndex);

            // 检查字符是否属于 HTML 标签
            const match = text.substring(charIndex).match(/^<[^>]+>/);
            if (match) {
                charToAdd = match[0];
                nextCharIndex += match[0].length;
            } else {
                nextCharIndex += 1;
            }

            setCurrentText(prev => prev + charToAdd);
            // 使用 setTimeout 而不是 requestAnimationFrame 来控制速度
            const timeoutId = setTimeout(() => type(text, nextCharIndex), config.typingSpeed);
            return () => clearTimeout(timeoutId);
        } else {
            // 打字完成，开始暂停
            const timeoutId = setTimeout(() => erase(text), config.pauseTime);
            return () => clearTimeout(timeoutId);
        }
        return () => {
        }; // 默认返回一个空清理函数
    }, [config.typingSpeed, config.pauseTime]);

    const erase = useCallback((text: string) => {
        let textToErase = text;

        const eraseChar = () => {
            if (textToErase.length > 0) {
                // 检查并清除 HTML 标签
                const tagEndIndex = textToErase.lastIndexOf('>');
                const tagStartIndex = textToErase.lastIndexOf('<');

                if (tagEndIndex > tagStartIndex && tagStartIndex !== -1) {
                    textToErase = textToErase.substring(0, tagStartIndex);
                } else {
                    textToErase = textToErase.substring(0, textToErase.length - 1);
                }

                setCurrentText(textToErase);
                const timeoutId = setTimeout(eraseChar, config.deletingSpeed);
                return () => clearTimeout(timeoutId);
            } else {
                // 清除完成，切换到下一个标题
                setTitleIndex(prev => (prev + 1) % texts.length);
            }
        };
        const timeoutId = setTimeout(eraseChar, config.deletingSpeed);
        return () => clearTimeout(timeoutId);
    }, [config.deletingSpeed, texts.length]);

    useEffect(() => {
        const currentTitle = texts[titleIndex];
        // 确保清除后从空状态开始打字
        setCurrentText('');
        return type(currentTitle);
    }, [titleIndex, texts, type]);

    return currentText;
};
export const HeroSectionTitle = () => {
    const dynamicTitleHtml = useTypingEffect(titles, typingConfig);

    return (
        <section className={`absolute inset-0 overflow-hidden flex justify-center items-center font-sans`}>
            {/* 前景内容主体层 */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* 状态标签 (使用 Framer Motion) */}
                <motion.p
                    className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-4"
                    variants={FadeInUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={0} // Delay 0.3s
                >
                    [ <span className="animate-pulse">AI Agent | 驱动核心</span> ]
                </motion.p>

                {/* 动态标题区域 */}
                <h1 className="flex items-center justify-center text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight"
                    style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)'}}
                >
                    {/* 使用 dangerouslySetInnerHTML 注入打字机 HTML 字符串 */}
                    <span id="dynamic-title-text" dangerouslySetInnerHTML={{__html: dynamicTitleHtml}}></span>
                    {!dynamicTitleHtml && <span>&nbsp;</span>}
                    {/* 固定的闪烁光标 */}
                    <motion.span
                        className={`inline-block h-[1em] ml-0.5 border-r-4 border-[${CssVariableNames.borderColor}]`}
                        animate={{opacity: [0, 1]}}
                        transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            repeatType: "mirror" as const,
                            ease: "easeInOut"
                        }}
                    />
                </h1>

                {/* 描述文字 (使用 Framer Motion) */}
                <motion.p
                    className={`mt-8 max-w-3xl mx-auto text-xl text-[${CssVariableNames.foregroundColor}] mb-12`}
                    variants={FadeInUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={1} // Delay 0.5s (0.2 * 1 + 0.3)
                >
                    {siteConfig.name} 平台利用前沿技术栈，为您打造下一代智能教育解决方案。
                </motion.p>

                {/* 动作按钮组 (使用 Framer Motion) */}
                <motion.div
                    className="mt-10 flex flex-col sm:flex-row justify-center gap-5"
                    variants={FadeInUpVariant}
                    initial="hidden"
                    animate="visible"
                    custom={2} // Delay 0.7s
                >
                    <a href="#"
                       className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 transition duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/50 relative overflow-hidden group">
                        立即创建 Agent
                        <span
                            className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out bg-white opacity-20 group-hover:w-0 group-hover:h-0"></span>
                    </a>
                    <a href="#"
                       className="inline-flex items-center justify-center px-10 py-4 border border-cyan-500 text-lg font-medium rounded-xl text-cyan-400 hover:bg-cyan-900/40 transition duration-300 transform hover:scale-105">
                        观看演示视频
                    </a>
                </motion.div>

                {/* 数据统计区 (使用 Framer Motion) */}
                {/*<div className="mt-20 flex justify-center space-x-16">*/}
                {/*    <motion.div*/}
                {/*        className="text-white"*/}
                {/*        variants={fadeInUpVariant}*/}
                {/*        initial="hidden"*/}
                {/*        animate="visible"*/}
                {/*        custom={3} // Delay 0.9s*/}
                {/*    >*/}
                {/*        <p className="text-5xl font-extrabold text-cyan-400">*/}
                {/*            10<span className="text-xl">+</span>*/}
                {/*        </p>*/}
                {/*        <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">核心模型</p>*/}
                {/*    </motion.div>*/}
                {/*    <motion.div*/}
                {/*        className="text-white"*/}
                {/*        variants={fadeInUpVariant}*/}
                {/*        initial="hidden"*/}
                {/*        animate="visible"*/}
                {/*        custom={4} // Delay 1.1s*/}
                {/*    >*/}
                {/*        <p className="text-5xl font-extrabold text-fuchsia-400">*/}
                {/*            99<span className="text-xl">%</span>*/}
                {/*        </p>*/}
                {/*        <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">任务成功率</p>*/}
                {/*    </motion.div>*/}
                {/*    <motion.div*/}
                {/*        className="text-white"*/}
                {/*        variants={fadeInUpVariant}*/}
                {/*        initial="hidden"*/}
                {/*        animate="visible"*/}
                {/*        custom={5} // Delay 1.3s*/}
                {/*    >*/}
                {/*        <p className="text-5xl font-extrabold text-gray-200">*/}
                {/*            24<span className="text-xl">/7</span>*/}
                {/*        </p>*/}
                {/*        <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">实时支持</p>*/}
                {/*    </motion.div>*/}
                {/*</div>*/}
            </div>
        </section>
    );
}
