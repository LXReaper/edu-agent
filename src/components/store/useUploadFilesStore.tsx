import { create } from 'zustand';

// https://zustand.docs.pmnd.rs/guides/updating-state

export interface UploadedFile {
    fileName: string;
    oldName: string;
    size: number;
    type: string;
    file: File;
}

type State = {
    uploadedFiles: UploadedFile[];// 样式的变量
};

type Action = {
    addUploadedFiles: (...files: File[]) => void;
    getUploadedFile: (fileName: string) => UploadedFile;
    removeUploadedFile: (fileName: string) => void;
};

export const useUploadFilesStore = create<State & Action>((setState, getState) => ({
    uploadedFiles: [],
    addUploadedFiles: (...files: File[]) => {
        const curAddUploadedFiles: UploadedFile[] = files.map((file) => {
            const extension = file.name.split('.').pop();
            return {
                fileName: Date.now() + extension,
                oldName: file.name,
                size: file.size,
                type: file.type,
                file: file
            }
        });
        setState((state) => {
            return {
                uploadedFiles: [...state.uploadedFiles, ...curAddUploadedFiles]
            }
        });
    },
    getUploadedFile: (fileName: string) => {
        const state = getState();
        return state.uploadedFiles.find((file: UploadedFile) => file.fileName == fileName);
    },
    removeUploadedFile: (fileName: string) => {
        setState((state) => {
            return { uploadedFiles: state.uploadedFiles.filter(file => file.fileName !== fileName) };
        });
    },
}));
