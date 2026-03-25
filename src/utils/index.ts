import {useEffect, useRef} from "react";
import {themeConfig} from "../lib";
import type {CssVariableName} from "../lib";

// 某个组件外触发鼠标点击事件时，会调用callback函数
export const useClickOutsideComponent = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEvent = (event: MouseEvent | TouchEvent) => {
            const target = (event as MouseEvent).target ?? (event as TouchEvent).touches[0].target;
            if (ref.current && !ref.current.contains(target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleEvent);
        document.addEventListener('touchstart', handleEvent);

        return () => {
            document.removeEventListener('mousedown', handleEvent);
            document.removeEventListener('touchstart', handleEvent);
        };
    }, [callback]);

    return [ref];
};

// 导出一个安全使用的定时器
export const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef<() => void>(null);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current?.();
        const timeout = setInterval(tick, delay);
        return () => clearInterval(timeout);
    }, [delay]);
}

// 修改主题样式
export const applyTheme = (setStyleVariable: (name: CssVariableName, value: string) => void) => {
    switch (themeConfig.currentTheme.split(":")[0]) {// 目前只有两个主题
        case themeConfig.themes.light.id:
            (Object.entries(themeConfig.themes.light.variables) as any).forEach(([variableName, variableValue]) => {
                setStyleVariable(variableName, variableValue);
            })
            break;
        case themeConfig.themes.dark.id:
            (Object.entries(themeConfig.themes.dark.variables) as any).forEach(([variableName, variableValue]) => {
                setStyleVariable(variableName, variableValue);
            })
            break;
    }
}


/** common工具 */
export class CommonUtils {
    public static isNotEmpty = (value) => {
        if (Array.isArray(value) && value.length) {
            return true;
        }
        if (value) return true;
    }

    // 满足某个条件时才执行
    public static doSomethingByCondition = (condition: boolean, action: () => void) => {
        if (condition) action();
    }
}
