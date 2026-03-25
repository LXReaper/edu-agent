import './App.css'
import React, {useEffect, useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {GlobalRouterPath} from "./constants";
import {Home} from "./app/home/page.tsx";
import {LocalStorageKeys, themeConfig} from "./lib";
import {useBasicConfigStore} from "./components/store/useBasicConfigStore.tsx";
import {DashBoard} from "./app/dashboard/page.tsx";
import {applyTheme} from "./utils";
import {LoginContainer} from "./components/basic/loginContainer.tsx";
import {AlertProvider} from "./hooks/AlertContext.tsx";
import {PptxPreviewContainer} from "./components/dashboard/ui/chatContainer/chatBoard/pptx/pptxPreviewContainer.tsx";
import {DocxPreviewContainer} from "./components/dashboard/ui/chatContainer/chatBoard/docx/DocxPreviewContainer.tsx";

export const App = () => {
    const {setStyleVariable} = useBasicConfigStore();
    const [loginModelIsOpen, setLoginModelIsOpen] = useState(false);

    useEffect(() => {
        const currentTheme = localStorage.getItem(LocalStorageKeys.currentTheme);
        if (!currentTheme) {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeConfig.currentTheme = (isDarkMode ? themeConfig.themes.dark.id : themeConfig.themes.light.id) + themeConfig.systemSuffix;
            localStorage.setItem(LocalStorageKeys.currentTheme, themeConfig.currentTheme);
            applyTheme(setStyleVariable);
            return ;
        }
        themeConfig.currentTheme = currentTheme;
        applyTheme(setStyleVariable);
    }, []);

    return (
        <div className="App">
            <AlertProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path={GlobalRouterPath.HOME} element={
                            <Home/> as React.ReactNode
                        }/>
                        <Route path={GlobalRouterPath.DASHBOARD} element={
                            <DashBoard
                                setLoginModelIsOpen={setLoginModelIsOpen}
                            /> as React.ReactNode
                        }/>
                        <Route path={GlobalRouterPath.DASHBOARD_DETAIL} element={
                            <DashBoard
                                setLoginModelIsOpen={setLoginModelIsOpen}
                            /> as React.ReactNode
                        }/>
                    </Routes>
                </BrowserRouter>
                <LoginContainer isOpen={loginModelIsOpen} onClose={() => setLoginModelIsOpen(false)} />
                <PptxPreviewContainer />
                <DocxPreviewContainer />
            </AlertProvider>
        </div>
    )
}
