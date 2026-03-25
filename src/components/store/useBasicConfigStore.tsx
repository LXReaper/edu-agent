import { create } from 'zustand';
import type {CssVariableName} from "../../lib";

// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    // 全局样式
    styleVariables: Record<CssVariableName, string>;// 样式的变量
};

type Action = {
    setStyleVariable: (name: CssVariableName, value: string) => void;
    getStyleVariable: (name: CssVariableName) => string;
    removeVariable: (name: CssVariableName) => void;
};

export const useBasicConfigStore = create<State & Action>((setState, getState) => ({
    styleVariables: {},
    setStyleVariable: (name: CssVariableName, value: string) => {
        // 更新 DOM
        document.body.style.setProperty(name, value);
        // 更新 Zustand 状态
        setState((state) => ({
            styleVariables: {
                ...state.styleVariables,
                [name]: value,
            },
        }));
    },
    getStyleVariable: (name: CssVariableName) => {
        const state = getState();
        return state.variables[name] ||
            getComputedStyle(document.body).getPropertyValue(name).trim();
    },
    removeVariable: (name) => {
        document.body.style.removeProperty(name);
        setState((state) => {
            const newVariables = { ...state.variables };
            delete newVariables[name];
            return { variables: newVariables };
        });
    },
}));
