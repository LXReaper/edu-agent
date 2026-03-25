'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import {useBasicConfigStore} from "../../../store/useBasicConfigStore.tsx";
import {LocalStorageKeys, themeConfig} from "../../../../lib";
import {applyTheme} from "../../../../utils";

export function ThemeToggle() {
    const {setStyleVariable} = useBasicConfigStore();

    const changeTheme = (newTheme: string) => {
        themeConfig.currentTheme = newTheme;// 修改当前主题
        localStorage.setItem(LocalStorageKeys.currentTheme, themeConfig.currentTheme);

        applyTheme(setStyleVariable);
    }
    return (
        <div className="relative cursor-pointer">
            {themeConfig.currentTheme.includes(themeConfig.themes.light.id) &&
                <div className={`flex justify-center items-center rounded-full h-8 w-8`}
                     onClick={() => changeTheme(themeConfig.themes.dark.id + themeConfig.userSuffix)}>
                    <Sun className="h-[1.2rem] w-[1.2rem] flex justify-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                </div>}
            {themeConfig.currentTheme.includes(themeConfig.themes.dark.id) &&
                <div className={`flex justify-center items-center rounded-full h-8 w-8`}
                     onClick={() => changeTheme(themeConfig.themes.light.id + themeConfig.userSuffix)}>
                    <Moon className="h-[1.2rem] w-[1.2rem] flex justify-center rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                </div>}
            <span className="sr-only">Toggle theme</span>
        </div>
    );
}
