import React, {useState} from "react";
import {motion, AnimatePresence} from "motion/react";
import {siteConfig} from "../../constants";
import {CssVariableNames} from "../../lib";
import {Google, Key, Mail, User, Wechat} from "@icon-park/react";
import {Verified} from "lucide-react";

interface LoginContainerProps {
    isOpen: boolean;
    onClose: () => void;
}
export const LoginContainer: React.FC<LoginContainerProps> = ({
    isOpen,
    onClose,
}) => {

    const [isShowMailPanel, setIsShowMailPanel] = useState(false);
    const [isShowAccountPanel, setIsShowAccountPanel] = useState(false);

    const [isShowVerificationCode, setIsShowVerificationCode] = useState(false);

    const closeAll = () => {
        onClose();
        close();
    }

    const close = () => {
        setIsShowMailPanel(false);
        setIsShowAccountPanel(false);

        setIsShowVerificationCode(false);
    }

    return (
        <AnimatePresence>
            <>
                {isOpen && (
                    <div className="fixed inset-0 z-[2025] flex items-center justify-center">
                        {/* 遮罩层 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 bg-black bg-opacity-60`}
                            onClick={closeAll}
                        />

                        {/* 登录面板 */}
                        <motion.div
                            initial={{scale: 0.9, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.9, opacity: 0}}
                            transition={{type: "spring", damping: 20}}
                            className={`relative bg-[${CssVariableNames.backgroundColor}] z-[2025] max-lg:min-w-[55vw] max-lg:w-[55vw] max-lg:max-w-[55vw]
                                lg:min-w-[52vw] lg:w-[52vw] lg:max-w-[52vw] xl:min-w-[45vw] xl:w-[45vw] xl:max-w-[45vw] 
                                2xl:min-w-[33vw] 2xl:w-[33vw] 2xl:max-w-[33vw] rounded-3xl shadow-xl text-[${CssVariableNames.foregroundColor}]`}
                        >
                            <div
                                className={`flex justify-center items-center select-none pointer-events-none`}>
                                <img alt="login background image" loading="lazy" decoding="async"
                                     data-nimg="1" className="hidden rounded-t-3xl md:h-[181px] max-md:h-[15vh] w-full max-w-full max-h-full
                                        object-cover md:block max-md:block text-transparent"
                                     src={siteConfig.loginContainerImg} />
                            </div>

                            {/*title*/}
                            <div className="max-md:text-[15pt] flex flex-col justify-center items-center gap-[1vh] md:p-3 font-bold">
                                <div className={`lg:text-[20pt] md:text-[17pt]`}>Welcome to {siteConfig.name}</div>
                                <div className={`text-[#a9a9a9] mt-2 lg:text-[14px] md:text-[10px] max-md:text-[8pt] font-[400] leading-[24px]`}>
                                    Create an account or log in to continue
                                </div>
                            </div>

                            {/*select the login method*/}
                            {!isShowMailPanel && !isShowAccountPanel && <motion.div
                                initial={{scale: 0.9, y: 5, opacity: 0}}
                                animate={{scale: 1, y: 0, opacity: 1}}
                                exit={{scale: 0.9, y: 5, opacity: 0}}
                                transition={{type: "spring", damping: 20}}
                                className={`p-[25px] md:p-[32px] flex flex-col gap-[2vh] lg:text-[14px] md:text-[10px] max-md:text-[8pt]`}>
                                <div className={`border-[${CssVariableNames.borderColor}] hover:bg-[#aaa] 
                                    flex h-[48px] w-full items-center justify-center rounded-full cursor-pointer
                                    border transition-all duration-300 md:font-[500] gap-[1vw]`}
                                >
                                    <span><Google size={20}/></span>
                                    <span>Continue with Google</span>
                                </div>
                                <div className={`border-[${CssVariableNames.borderColor}] hover:bg-[#aaa] 
                                    flex h-[48px] w-full items-center justify-center rounded-full cursor-pointer
                                    border transition-all duration-300 md:font-[500] gap-[1vw]`}
                                    onClick={() => setIsShowAccountPanel(true)}
                                >
                                    <span><User size={20}/></span>
                                    <span>Continue with Account</span>
                                </div>
                                <div className={`border-[${CssVariableNames.borderColor}] hover:bg-[#aaa] 
                                    flex h-[48px] w-full items-center justify-center rounded-full cursor-pointer
                                    border transition-all duration-300 md:font-[500] gap-[1vw]`}
                                    onClick={() => setIsShowMailPanel(true)}
                                >
                                    <span><Mail size={20}/></span>
                                    <span>Continue with Mail</span>
                                </div>
                            </motion.div>}

                            {/*Mail login*/}
                            {isShowMailPanel && <motion.div
                                initial={{scale: 0.9, y: 5, opacity: 0}}
                                animate={{scale: 1, y: 0, opacity: 1}}
                                exit={{scale: 0.9, y: 5, opacity: 0}}
                                transition={{type: "spring", damping: 20}}
                                className="space-y-4 flex flex-col gap-[2vh] px-[25px] pb-[25px] md:px-[32px] md:pb-[32px]
                                    lg:text-[14px] md:text-[10px] max-md:text-[8pt]">
                                <div>
                                    <label className="block mb-1 flex gap-[0.5rem] items-center select-none pointer-events-none"><Mail />Mail</label>
                                    <input
                                        type="text"
                                        className={`w-full px-3 py-2 text-[${CssVariableNames.backgroundColor}] rounded-full`}
                                        placeholder="Please enter your mail address"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 flex gap-[0.5rem] items-center select-none pointer-events-none">
                                        <Verified />Verification Code
                                    </label>
                                    <div className={`flex`}>
                                        <input
                                            type="text"
                                            className={`w-full px-3 py-2 border-none text-[${CssVariableNames.backgroundColor}] rounded-l-full`}
                                            placeholder="Please enter verification code"
                                        />
                                        <div className={`w-[7vw] bg-[${CssVariableNames.technologyButtonColor}] rounded-r-full 
                                            cursor-pointer select-none flex justify-center items-center font-bold 
                                            lg:text-[13px] md:text-[9px] max-md:text-[5pt] text-white`}>Get code</div>
                                    </div>
                                </div>

                                <div className={`flex justify-center justify-between flex-1`}>
                                    <div
                                        onClick={close}
                                        className={`cursor-pointer select-none text-[#a9a9a9] text-[14px] font-[400] leading-[12px]`}>
                                        Turn back
                                    </div>
                                </div>

                                <button
                                    className={`w-full py-2 px-4 bg-[${CssVariableNames.technologyButtonColor}] text-white rounded-full hover:bg-blue-600`}>
                                    Sign in
                                </button>
                            </motion.div>}

                            {/*Account login*/}
                            {isShowAccountPanel && <motion.div
                                initial={{scale: 0.9, y: 5, opacity: 0}}
                                animate={{scale: 1, y: 0, opacity: 1}}
                                exit={{scale: 0.9, y: 5, opacity: 0}}
                                transition={{type: "spring", damping: 20}}
                                className="space-y-4 flex flex-col gap-[2vh] px-[25px] pb-[25px] md:px-[32px] md:pb-[32px]
                                    lg:text-[14px] md:text-[10px] max-md:text-[8pt]">
                                <div>
                                    <label className="block mb-1 flex gap-[0.5rem] items-center select-none pointer-events-none"><User />Account</label>
                                    <input
                                        type="text"
                                        className={`w-full px-3 py-2 text-[${CssVariableNames.backgroundColor}] rounded-full`}
                                        placeholder="Please enter phone number or account"
                                    />
                                </div>

                                {!isShowVerificationCode && <div>
                                    <label className="block mb-1 flex gap-[0.5rem] items-center select-none pointer-events-none"><Key />Password</label>
                                    <input
                                        type="password"
                                        className={`w-full px-3 py-2 text-[${CssVariableNames.backgroundColor}] rounded-full`}
                                        placeholder="Please enter password"
                                    />
                                </div>}

                                {isShowVerificationCode && <div>
                                    <label className="block mb-1 flex gap-[0.5rem] items-center select-none pointer-events-none">
                                        <Verified />Verification Code
                                    </label>
                                    <div className={`flex`}>
                                        <input
                                            type="text"
                                            className={`w-full px-3 py-2 border-none text-[${CssVariableNames.backgroundColor}] rounded-l-full`}
                                            placeholder="Please enter verification code"
                                        />
                                        <div className={`w-[7vw] bg-[${CssVariableNames.technologyButtonColor}] rounded-r-full 
                                            cursor-pointer select-none flex justify-center items-center font-bold 
                                            lg:text-[13px] md:text-[9px] max-md:text-[5pt]`}>Get code
                                        </div>
                                    </div>
                                </div>}

                                <div className={`flex justify-center justify-between flex-1`}>
                                    <div
                                        onClick={close}
                                        className={`cursor-pointer select-none text-[#a9a9a9] text-[14px] font-[400] leading-[12px]`}>
                                        Turn back
                                    </div>
                                    {!isShowVerificationCode && <div
                                        onClick={() => setIsShowVerificationCode(true)}
                                        className={`cursor-pointer select-none text-[#a9a9a9] text-[14px] font-[400] leading-[12px]`}>
                                        Use verification code
                                    </div>}
                                    {isShowVerificationCode && <div
                                        onClick={() => setIsShowVerificationCode(false)}
                                        className={`cursor-pointer select-none text-[#a9a9a9] text-[14px] font-[400] leading-[12px]`}>
                                        Use password
                                    </div>}
                                </div>

                                <button className={`w-full py-2 px-4 bg-[${CssVariableNames.technologyButtonColor}] text-white rounded-full hover:bg-blue-600`}>
                                    Sign in
                                </button>
                            </motion.div>}

                            {/*footer*/}
                            <div
                                className="mb-[36px] flex flex-wrap items-center justify-center gap-1
                                    lg:text-[14px] md:text-[10px] max-md:text-[8pt] text-[#a9a9a9] md:px-[80px]">
                                <div>Sign in to {siteConfig.name} using multiple methods.</div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </>
        </AnimatePresence>
    )
}
