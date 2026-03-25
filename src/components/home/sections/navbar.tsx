'use client';

import "../ui/nav/navbar.css"
import {NavMenu} from "../ui/nav/navMenu.tsx";
import {LeftNavMenu} from "../ui/nav/leftNavMenu.tsx";
import {motion, AnimatePresence, useScroll} from 'motion/react';
import React, {useEffect, useState} from "react";
import {RightNavMenu} from "../ui/nav/rightNavMenu.tsx";
import {CssVariableNames} from "../../../lib";
import {siteConfig} from "../../../constants";
import {useNavigate} from "react-router-dom";
import {useClickOutsideComponent} from "../../../utils";

const INITIAL_WIDTH = '70rem';
const MAX_WIDTH = '1000px';
const navs = siteConfig.nav;
export const Navbar = () => {
    const {scrollY} = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [drawerRef] = useClickOutsideComponent(() => setIsDrawerOpen(false));

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            setHasScrolled(latest > 10);// 往下滑了10px
        });
        return unsubscribe;
    }, [scrollY]);

    const navTo = (href: string) => {
        setIsDrawerOpen(false)
        navigate(href);
    }
    return (
        <header
            className={`fixed z-[2025] flex justify-center transition-all duration-300 
                ${hasScrolled ? 'top-6 mx-4' : 'top-4 mx-2'}
                left-0 right-0 mx-auto
            `}
        >
            <motion.div
                initial={{width: INITIAL_WIDTH}}
                animate={{width: hasScrolled ? MAX_WIDTH : INITIAL_WIDTH}}
                transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
            >
                <div
                    style={{padding: "0 5%"}}
                    className={`navbar border bg-[${CssVariableNames.backgroundColor}]/75 
                        ${hasScrolled ? "backdrop-blur-lg border-[1px] border-[" + CssVariableNames.borderColor + "]" : ("border-none")}`
                    }
                >
                    {/*left nav*/}
                    <LeftNavMenu/>
                    {/*middle nav*/}
                    <NavMenu/>
                    {/*right nav*/}
                    <RightNavMenu isDrawerOpen={isDrawerOpen} setIsDrawerOpen={(isOpen) => setIsDrawerOpen(isOpen)}/>
                </div>
            </motion.div>

            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <div
                            ref={drawerRef}
                            className={`fixed left-0 right-0 md:hidden ${hasScrolled ? 'top-[5rem]' : 'top-[4.5rem]'}`}>
                            <motion.div
                                key={isDrawerOpen ? 1 : 0}
                                initial={{width: "97vw", opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3, ease: [0.25, 0.1, 0.25, 1]}}
                            >
                                <div
                                    style={{padding: "3% 3%"}}
                                    className={`flex flex-col rounded-[1rem] border bg-[${CssVariableNames.backgroundColor}]/75 
                                        backdrop-blur-lg border-[${CssVariableNames.borderColor}] text-[${CssVariableNames.foregroundColor}]`
                                    }
                                >
                                    <div className={`w-[2rem] cursor-pointer my-[3%]`}
                                         onClick={() => navTo("/")}>{siteConfig.name}</div>
                                    <div
                                        className={`border border-[${CssVariableNames.borderColor}] select-none cursor-pointer rounded-[0.5rem]`}>
                                        {navs.links.map((link, index) => (
                                            <div
                                                key={index}
                                                className={`p-2.5 border-b border-border border-[${CssVariableNames.borderColor}] 
                                                    last:border-b-0 min-w-[100%]`} onClick={() => navTo(link.href)}>
                                                {link.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`flex w-[2rem] cursor-pointer my-[3%]`}></div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                ) as React.ReactNode}
            </AnimatePresence>
        </header>
    )
}

