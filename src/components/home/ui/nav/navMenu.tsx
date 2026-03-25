'use client';

import {motion} from 'motion/react';
import React, {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {siteConfig} from "../../../../constants";
import {useLocation, useNavigate} from "react-router-dom";
import {CssVariableNames} from "../../../../lib";

interface NavItem {
    name: string;
    href: string;
}

const navs: NavItem[] = siteConfig.nav.links;

export function NavMenu() {
    const ref = useRef<HTMLUListElement>(null);
    const [left, setLeft] = useState(0);
    const [width, setWidth] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();
    const pathname = useLocation().pathname;
    // 初始化指示器位置
    useEffect(() => {
        // 等待DOM渲染完成
        setTimeout(() => {
            setIsReady(true);
            let targetElement: HTMLLIElement | null = null;// 目标导航栏菜单元素
            // 1) 先尝试找到当前路径对应的激活项
            const activeNav = navs.find(item => pathname.startsWith(item.href));
            if (activeNav) {
                const activeElement = ref.current.querySelector(`li a[href="${activeNav.href}"]`)?.parentElement;
                if (activeElement) {
                    targetElement = activeElement as HTMLLIElement;
                }
            }
            // 2) 如果没有找到激活项，则使用第一个li或href为"/"的项
            if (!targetElement) {
                // 尝试找到href为"/"的项
                const homeElement = ref.current.querySelector(`li a[href="/"]`)?.parentElement;
                if (homeElement) targetElement = homeElement as HTMLLIElement;
            }
            if (targetElement) updateIndicatorPosition(targetElement);
        }, 100);
    }, [pathname]);

    // 更新指示器位置
    const updateIndicatorPosition = (element) => {
        const { offsetLeft, offsetWidth } = element;
        setLeft(offsetLeft);
        setWidth(offsetWidth);
    };

    // 处理点击事件
    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        item: NavItem,
    ) => {
        e.preventDefault();
        const liElement = e.currentTarget.parentElement;
        updateIndicatorPosition(liElement);

        // 实际导航逻辑
        setTimeout(() => {
            navigate(item.href);
        }, 300);
    }
    return (
        <div className={`hidden md:flex items-center justify-center flex-grow`}>
            <div className={`w-full hidden md:block`}>
                <ul
                    className={`relative mx-auto flex w-fit rounded-full h-11 px-2 items-center justify-center`}
                    ref={ref}
                >
                    {navs.map((item) => (
                        <li
                            key={item.name}
                            className={`z-10 cursor-pointer h-full flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                (pathname.startsWith(item.href)
                                    ? 'text-primary'
                                    : 'text-primary/60 hover:text-primary')
                            } tracking-tight`}
                        >
                            <a href={item.href} onClick={(e) => handleClick(e, item)}>
                                {item.name}
                            </a>
                        </li>
                    ))}
                    {isReady && (
                        <motion.li
                            animate={{left, width}}
                            transition={{type: 'spring', stiffness: 400, damping: 30}}
                            className={`absolute inset-0 my-1.5 rounded-full 
                                bg-[${CssVariableNames.buttonHoverColor}] border-[${CssVariableNames.buttonHoverColor}] border`
                            }
                        />
                    )}
                </ul>
            </div>
        </div>
    );
}
