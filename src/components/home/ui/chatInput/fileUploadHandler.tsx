import {Loader2, Paperclip} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../toolTip.tsx";
import {CssVariableNames} from "../../../../lib";
import React, {useEffect, useState} from "react";

export const FileUploadHandler = () => {
    const isLoggedIn = true;// todo 默认设置为已登录
    const {loading, setLoading} = useState(false);
    const {disabled, setDisabled} = useState(false);
    const {isAgentRunning, setIsAgentRunning} = useState(false);
    const {isUploading, setIsUploading} = useState(false);

    const ref = React.createRef();

    const handleFileUpload = () => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.click();
        }
    }

    const processFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const files = Array.from(event.target.files);

        // handleFiles(
        //     files,
        //     sandboxId,
        //     setPendingFiles,
        //     setUploadedFiles,
        //     setIsUploading,
        //     messages,
        //     queryClient,
        // );

        event.target.value = '';
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span onClick={handleFileUpload} className={`flex justify-center items-center rounded-[15px] gap-[5%] border px-[15%] py-[8%]
                            ${!isLoggedIn || loading || (disabled && !isAgentRunning) || isUploading ? "cursor-default" : "cursor-pointer"}
                            text-[${CssVariableNames.foregroundColor}]`}>
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (
                                <Paperclip className="h-4 w-4"/>
                            )}
                            <span className={`text-sm select-none`}>Attach</span>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" direction="bottom">
                        <p>{isLoggedIn ? 'Attach files' : 'Please login to attach files'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <input
                type="file"
                ref={ref}
                className="hidden"
                onChange={processFileUpload}
                multiple
            />
        </>
    )
}
