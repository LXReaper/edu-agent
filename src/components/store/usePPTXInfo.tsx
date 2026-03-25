import {create} from "zustand";
import {PPTXController} from "../../api/PPTXController.ts";
import type {SlideData} from "../../api/entity/vo/SlideData.ts";

// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    pptTitle: string;
    pptProjectId: string;
    isOpenPPTXPreviewContainer: boolean;
    pptSlideDataList: SlideData[];
    currentPage: number;
};

type Action = {
    isOpen: () => boolean;
    setPPTTitle: (newTitle: string) => void;
    getPPTTitle: () => string;
    getPPTSlideDataList: () => SlideData[];
    getPPTSlideDataByPageNumber: (pageNumber: number) => SlideData;
    getPPTSlideDataByCurrentPageNumber: () => SlideData;
    isLastPage: () => boolean;
    isFirstPage: () => boolean;
    currentPageIsEqualIndex: (index: number) => boolean;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (pageNumber: number) => void;
    getCurrentPageNumber: () => number;
    getCurrentPageProgressInSlideDataList: () => number;
    updatePPTXPreviewContainerIfEqualProjectId: (projectId: string) => void;
    openPPTXPreviewContainer: (projectId: string, title?: string) => void;
    closePPTXPreviewContainer: () => void;
    clearPPTXInfo: () => void;
};

export const usePPTXInfo = create<State & Action>((setState, getState) => ({
    pptTitle: "",
    pptProjectId: "",
    isOpenPPTXPreviewContainer: false,
    pptSlideDataList: [],
    currentPage: 0,
    isOpen: () => {
        const state = getState();
        if (!state) return false;
        return state.isOpenPPTXPreviewContainer;
    },
    setPPTTitle: (newTitle: string) => {
        setState(state => ({
            ...state,
            pptTitle: newTitle,
        }))
    },
    getPPTTitle: () => {
        const state = getState();
        if (!state) return "";
        return state.pptTitle;
    },
    getPPTSlideDataList: () => {
        const state = getState();
        if (!state) return [];
        return state.pptSlideDataList;
    },
    getPPTSlideDataByPageNumber: (pageNumber: number) => {
        const state = getState();
        if (!state || state.pptSlideDataList.length <= 0) return {};
        return state.pptSlideDataList[pageNumber];
    },
    getPPTSlideDataByCurrentPageNumber: () => {
        const state = getState();
        if (!state || state.pptSlideDataList.length <= 0 || state.currentPage >= state.pptSlideDataList.length) return {};
        return state.pptSlideDataList[state.currentPage];
    },
    isLastPage: () => {
        const state = getState();
        if (!state || state.pptSlideDataList.length === 0) return true;
        return state.currentPage === state.pptSlideDataList.length - 1;
    },
    isFirstPage: () => {
        const state = getState();
        if (!state) return true;
        return state.currentPage === 0;
    },
    currentPageIsEqualIndex: (index: number) => {
        const state = getState();
        if (!state) return false;
        return state.currentPage === index;
    },
    nextPage: () => {
        const state = getState();
        const pageNumber = state.currentPage + 1;
        if (pageNumber < 0 || pageNumber >= state.pptSlideDataList.length) return;
        setState(({
            ...state,
            currentPage: pageNumber,
        }));
    },
    prevPage: () => {
        const state = getState();
        const pageNumber = state.currentPage - 1;
        if (pageNumber < 0 || pageNumber >= state.pptSlideDataList.length) return;
        setState(({
            ...state,
            currentPage: pageNumber,
        }));
    },
    setPage: (pageNumber: number) => {
        const state = getState();
        if (pageNumber < 0 || pageNumber >= state.pptSlideDataList.length) return;
        setState(({
            ...state,
            currentPage: pageNumber,
        }));
    },
    getCurrentPageNumber: () => {
        const state = getState();
        if (!state) return 0;
        return state.currentPage;
    },
    getCurrentPageProgressInSlideDataList: () => {
        const state = getState();
        if (!state || state.pptSlideDataList.length <= 0) return 0;
        return (state.currentPage + 1) / (state.pptSlideDataList.length);
    },
    updatePPTXPreviewContainerIfEqualProjectId: async (projectId: string) => {
        const oldState = getState();
        let slideDataList = oldState.pptSlideDataList;
        if (oldState.pptProjectId === projectId) {
            slideDataList = await PPTXController.getSlideDataByProjectId(projectId);
        }
        if (!slideDataList || slideDataList.length <= 0) return;
        setState(state => ({
            ...state,
            pptSlideDataList: slideDataList,
        }))
    },
    openPPTXPreviewContainer: async (projectId: string, title = "") => {
        const oldState = getState();
        let slideDataList = oldState.pptSlideDataList;
        if (oldState.pptProjectId !== projectId) {
            slideDataList = await PPTXController.getSlideDataByProjectId(projectId);
        }
        if (!slideDataList || slideDataList.length <= 0) return;
        setState(state => ({
            ...state,
            pptTitle: title,
            pptProjectId: projectId,
            isOpenPPTXPreviewContainer: true,
            pptSlideDataList: slideDataList,
            currentPage: 0,
        }))
    },
    closePPTXPreviewContainer: () => {
        setState(state => ({
            ...state,
            isOpenPPTXPreviewContainer: false,
            currentPage: 0,
        }))
    },

    clearPPTXInfo: () => {
        setState(({
            pptTitle: "",
            pptProjectId: "",
            isOpenPPTXPreviewContainer: false,
            pptSlideDataList: [],
            currentPage: 0,
        }))
    }
}));
