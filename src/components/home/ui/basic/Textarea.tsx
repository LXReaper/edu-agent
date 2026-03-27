import React from "react";
import {CssVariableNames} from "../../../../lib";
import {siteConfig} from "../../../../constants";
export const Textarea = ({
    className,
    setInputValue,
    enterLaunchEvent,
    placeholder = `Give ${siteConfig.name} a task to complete...`,
    ...props
}: React.ComponentProps<'textarea'> & {
    setInputValue?: (value: string) => void;
    enterLaunchEvent?: () => void;
}) => {
    const handleKeyBoardEvents = (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            // Shift+Enter 强制换行（手动插入 \n）
            event.preventDefault();
            const textarea = event.target;
            if (!textarea) return ;
            if (setInputValue) {
                const startPos = textarea.selectionStart;
                setInputValue(textarea.value.substring(0, startPos) + '\n' + textarea.value.substring(startPos));
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = startPos + 1;
                    scrollToCursor(textarea);
                }, 0);
            }
        } else if (!event.ctrlKey && !event.shiftKey && !event.altKey && event.key === 'Enter') {
            event.preventDefault();
            if (enterLaunchEvent) enterLaunchEvent();
        }
    }

    const scrollToCursor = (textarea) => {
        const cursorPos = textarea.selectionStart;// 当前光标所在字符位置
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 1; // 默认行高
        const visibleLines = Math.floor(textarea.clientHeight / lineHeight);// 当前可视区域的行数
        const cursorLine = (textarea.value.substring(0, cursorPos).match(/\n/g) || []).length;// 当前光标所在行号

        // 如果光标行号超出当前可视区域底部
        if (cursorLine >= visibleLines) {
            textarea.scrollTop = (cursorLine - visibleLines + 1) * lineHeight;
        }
    };
    return (
        <div className="flex flex-col gap-1 px-2 py-1">
            <textarea data-slot="textarea"
                className={`border-[${CssVariableNames.inputBorderColor}] flex rounded-md border scrollbar-hide
                    py-2 outline-none border-none text-[${CssVariableNames.foregroundColor}]
                    shadow-none px-0.5 pb-6 pt-4 caret-[${CssVariableNames.foregroundColor}] ${className}`
                }
                placeholder={placeholder}
                rows="1" {...props}
                style={{ overflowY: "scroll" }}
                onKeyDown={handleKeyBoardEvents}
            >
            </textarea>
        </div>
    )
}
