import {create} from "zustand";
import {DocumentController} from "../../api/DocumentController.ts";

// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    tempDocxFileAccessPathTimeOut: any;

    microsoftOfficeOnline: string;
    tempDocxFileAccessPath: string;

    chatSessionId: string;
    filePath: string;
    isOpenDocxPreviewContainer: boolean;
};

type Action = {
    isOpen: () => boolean;

    getChatSessionId: () => string;
    getFilePath: () => string;

    setTempDocxFileAccessPath: () => string;
    getTempDocxFileAccessPath: () => string;

    openDocxPreviewContainer: (newChatSessionId: string, newFilePath: string) => void;
    closeDocxPreviewContainer: () => void;
    clearPPTXInfo: () => void;
};

export const useDocxInfo = create<State & Action>((setState, getState) => ({
    tempDocxFileAccessPathTimeOut: null,// tempDocxFileAccessPath到有效时间结束触发事件
    microsoftOfficeOnline: "https://view.officeapps.live.com/op/view.aspx?src=",
    tempDocxFileAccessPath: "",
    chatSessionId: "",
    filePath: "",
    isOpenDocxPreviewContainer: false,
    isOpen: () => {
        const state = getState();
        if (!state) return false;
        return state.isOpenDocxPreviewContainer;
    },

    getChatSessionId: () => {
        const state = getState();
        if (!state) return "";
        return state.chatSessionId;
    },
    getFilePath: () => {
        const state = getState();
        if (!state) return "";
        return state.filePath;
    },

    setTempDocxFileAccessPath: async () => {
        const state = getState();
        if (!state || !state.isOpenDocxPreviewContainer || state.tempDocxFileAccessPath || !state.chatSessionId || !state.filePath) {
            return ;
        }
        try {
            const tempAccessPath = await DocumentController.getDownloadUrl(state.chatSessionId, state.filePath);
            const encodedUrl = encodeURIComponent(tempAccessPath.trim());
            setState(({
                ...state,
                tempDocxFileAccessPathTimeOut: setTimeout(() => {
                    const state1 = getState();
                    if (state1 && state1.tempDocxFileAccessPathTimeOut) clearTimeout(state1.tempDocxFileAccessPathTimeOut);
                    setState(({
                        ...state1,
                        tempDocxFileAccessPathTimeOut: null,
                        tempDocxFileAccessPath: "",
                    }));
                }, 15 * 60 * 1000),
                tempDocxFileAccessPath: state.microsoftOfficeOnline + encodedUrl,
            }));
        } catch (e) {
            console.error("获取" + state.filePath + "的临时访问路径失败", e);
        }
    },
    getTempDocxFileAccessPath: () => {
        const state = getState();
        if (!state) return "";
        return state.tempDocxFileAccessPath;
    },

    openDocxPreviewContainer: (newChatSessionId: string, newFilePath: string) => {
        const state = getState();
        if (!state) return;
        let newTempDocxFileAccessPath = state.tempDocxFileAccessPath;
        let newTempDocxFileAccessPathTimeOut = state.tempDocxFileAccessPathTimeOut;

        if (state.chatSessionId !== newChatSessionId || state.filePath !== newFilePath) {// 打开了新的文件
            if (newTempDocxFileAccessPathTimeOut) {
                newTempDocxFileAccessPathTimeOut = null;
                clearTimeout(state.tempDocxFileAccessPathTimeOut);
            }
            newTempDocxFileAccessPath = "";
        }

        setState(({
            ...state,
            chatSessionId: newChatSessionId,
            filePath: newFilePath,
            tempDocxFileAccessPath: newTempDocxFileAccessPath,
            tempDocxFileAccessPathTimeOut: newTempDocxFileAccessPathTimeOut,
            isOpenDocxPreviewContainer: true,
        }))
    },
    closeDocxPreviewContainer: () => {
        setState(state => ({
            ...state,
            isOpenDocxPreviewContainer: false,
        }))
    },
    clearPPTXInfo: () => {
        const state = getState();
        if (state && state.tempDocxFileAccessPathTimeOut) clearTimeout(state.tempDocxFileAccessPathTimeOut);
        setState(({
            tempDocxFileAccessPathTimeOut: null,
            microsoftOfficeOnline: "https://view.officeapps.live.com/op/view.aspx?src=",
            tempDocxFileAccessPath: "",
            chatSessionId: "",
            filePath: "",
            isOpenDocxPreviewContainer: false,
        }))
    }
}));
