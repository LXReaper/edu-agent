import React, { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Presentation,
    Share2,
    X,
    Edit,
    Play,
    Save,
    Undo2,
    Redo2,
    Trash2,
    Copy,
    BringToFront,
    SendToBack,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react";
import type { SlideData } from "../../../../../../api/entity/vo/SlideData.ts";
import { usePPTXInfo } from "../../../../../store/usePPTXInfo.tsx";

const THUMB_WIDTH = 200;
const VIRTUAL_WIDTH = 1024;
const SCALE = THUMB_WIDTH / VIRTUAL_WIDTH;
const VIRTUAL_HEIGHT = VIRTUAL_WIDTH * (10 / 16);

// ---------- 构建注入 iframe 的快速编辑脚本（移除内部撤销/重做，改为向父组件发送快照）----------
const buildQuickEditScript = () => {
    return `
    (function() {
        if (window.__quickEditInitialized) return;
        window.__quickEditInitialized = true;

        let selectedElement = null;
        let resizeHandles = [];
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0, startLeft = 0, startTop = 0;
        let currentResizeHandle = null;
        let resizeStartWidth = 0, resizeStartHeight = 0, resizeStartLeft = 0, resizeStartTop = 0;
        let currentInlineEditor = null;
        
        // 设置键盘快捷键 (Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z)
        function setupKeyboardShortcuts() {
            window.addEventListener('keydown', (e) => {
                // 检查是否按下 Ctrl 或 Meta (Mac Command)
                const isModifier = e.ctrlKey || e.metaKey;
                if (!isModifier) return;
                
                // 撤销: Ctrl+Z 且没有 Shift 键
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.parent.postMessage({ type: 'editor:undo' }, '*');
                }
                // 重做: Ctrl+Y 或 Ctrl+Shift+Z
                else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.parent.postMessage({ type: 'editor:redo' }, '*');
                }
            });
        }

        function saveSnapshotToParent() {
            const currentHtml = document.documentElement.outerHTML;
            window.parent.postMessage({
                type: 'editor:saveSnapshot',
                html: currentHtml
            }, '*');
        }

        let pendingSave = null;
        function debouncedSaveSnapshot() {
            if (pendingSave) clearTimeout(pendingSave);
            pendingSave = setTimeout(() => {
                saveSnapshotToParent();
                pendingSave = null;
            }, 50);
        }

        function clearSelection() {
            const curSelectedElements = document.querySelectorAll('.quick-edit-element-selected');
            curSelectedElements.forEach(el => {
                el.classList.remove('quick-edit-element-selected');
                el.style.cursor = '';
            });
            removeResizeHandles();
            selectedElement = null;
        }

        function removeResizeHandles() {
            resizeHandles.forEach(handle => handle.remove());
            const selectedResizeElements = document.querySelectorAll('.editor-resize-handle');
            selectedResizeElements.forEach(el => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
            
            resizeHandles = [];
        }

        function getResizeCursor(dir) {
            const map = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', w: 'w-resize', e: 'e-resize', sw: 'sw-resize', s: 's-resize', se: 'se-resize' };
            return map[dir] || 'default';
        }

        function updateResizeHandlesPosition(element) {
            const rect = element.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const left = rect.left + scrollLeft;
            const top = rect.top + scrollTop;
            const width = rect.width;
            const height = rect.height;
            const positions = {
                nw: { left: left - 6, top: top - 6 },
                n:  { left: left + width/2 - 6, top: top - 6 },
                ne: { left: left + width - 6, top: top - 6 },
                w:  { left: left - 6, top: top + height/2 - 6 },
                e:  { left: left + width - 6, top: top + height/2 - 6 },
                sw: { left: left - 6, top: top + height - 6 },
                s:  { left: left + width/2 - 6, top: top + height - 6 },
                se: { left: left + width - 6, top: top + height - 6 }
            };
            resizeHandles.forEach(handle => {
                const dir = handle.getAttribute('data-resize-dir');
                const pos = positions[dir];
                if (pos) {
                    handle.style.left = pos.left + 'px';
                    handle.style.top = pos.top + 'px';
                }
            });
        }

        function addResizeHandles(element) {
            removeResizeHandles();
            const container = document.body;
            const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
            handles.forEach(dir => {
                const handle = document.createElement('div');
                handle.className = 'editor-resize-handle';
                handle.setAttribute('data-resize-dir', dir);
                handle.style.cursor = getResizeCursor(dir);
                handle.addEventListener('mousedown', onResizeMouseDown);
                container.appendChild(handle);
                resizeHandles.push(handle);
            });
            updateResizeHandlesPosition(element);
        }

        function selectElement(el) {
            if (selectedElement === el) return;
            clearSelection();
            selectedElement = el;
            selectedElement.classList.add('quick-edit-element-selected');
            addResizeHandles(selectedElement);
        }

        function onDragMouseDown(e) {
            if (!selectedElement || e.target.closest('.editor-resize-handle')) return;
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startLeft = parseFloat(selectedElement.style.left) || 0;
            startTop = parseFloat(selectedElement.style.top) || 0;
            document.addEventListener('mousemove', onDragMouseMove);
            document.addEventListener('mouseup', onDragMouseUp);
        }

        function onDragMouseMove(e) {
            if (!selectedElement) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            selectedElement.style.left = (startLeft + dx) + 'px';
            selectedElement.style.top = (startTop + dy) + 'px';
            updateResizeHandlesPosition(selectedElement);
        }

        function onDragMouseUp() {
            if (isDragging) debouncedSaveSnapshot();
            isDragging = false;
            document.removeEventListener('mousemove', onDragMouseMove);
            document.removeEventListener('mouseup', onDragMouseUp);
        }

        function onResizeMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!selectedElement) return;
            currentResizeHandle = e.target.getAttribute('data-resize-dir');
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = selectedElement.getBoundingClientRect();
            resizeStartWidth = rect.width;
            resizeStartHeight = rect.height;
            resizeStartLeft = parseFloat(selectedElement.style.left) || rect.left;
            resizeStartTop = parseFloat(selectedElement.style.top) || rect.top;
            document.addEventListener('mousemove', onResizeMouseMove);
            document.addEventListener('mouseup', onResizeMouseUp);
        }

        function onResizeMouseMove(e) {
            if (!currentResizeHandle) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            let newWidth = resizeStartWidth, newHeight = resizeStartHeight;
            let newLeft = resizeStartLeft, newTop = resizeStartTop;

            switch(currentResizeHandle) {
                case 'e': newWidth = Math.max(20, resizeStartWidth + dx); break;
                case 'w': newWidth = Math.max(20, resizeStartWidth - dx); newLeft = resizeStartLeft + dx; break;
                case 's': newHeight = Math.max(20, resizeStartHeight + dy); break;
                case 'n': newHeight = Math.max(20, resizeStartHeight - dy); newTop = resizeStartTop + dy; break;
                case 'ne': newWidth = Math.max(20, resizeStartWidth + dx); newHeight = Math.max(20, resizeStartHeight - dy); newTop = resizeStartTop + dy; break;
                case 'nw': newWidth = Math.max(20, resizeStartWidth - dx); newLeft = resizeStartLeft + dx; newHeight = Math.max(20, resizeStartHeight - dy); newTop = resizeStartTop + dy; break;
                case 'se': newWidth = Math.max(20, resizeStartWidth + dx); newHeight = Math.max(20, resizeStartHeight + dy); break;
                case 'sw': newWidth = Math.max(20, resizeStartWidth - dx); newLeft = resizeStartLeft + dx; newHeight = Math.max(20, resizeStartHeight + dy); break;
            }
            selectedElement.style.width = newWidth + 'px';
            selectedElement.style.height = newHeight + 'px';
            selectedElement.style.left = newLeft + 'px';
            selectedElement.style.top = newTop + 'px';
            updateResizeHandlesPosition(selectedElement);
        }

        function onResizeMouseUp() {
            if (currentResizeHandle) debouncedSaveSnapshot();
            currentResizeHandle = null;
            document.removeEventListener('mousemove', onResizeMouseMove);
            document.removeEventListener('mouseup', onResizeMouseUp);
        }

        function makeElementDirectlyEditable(element) {
            if (currentInlineEditor) finishDirectEdit(true);
            const originalText = element.textContent;
            const originalHTML = element.innerHTML;
            currentInlineEditor = { element, originalText, originalHTML };
            element.contentEditable = true;
            element.classList.add('direct-editing');
            element.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            element.addEventListener('keydown', handleDirectEditKeydown);
            element.addEventListener('blur', handleDirectEditBlur);
        }

        function handleDirectEditKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                finishDirectEdit(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishDirectEdit(false);
            }
        }

        function handleDirectEditBlur(e) {
            setTimeout(() => {
                if (currentInlineEditor && currentInlineEditor.element === e.target) {
                    finishDirectEdit(true);
                }
            }, 100);
        }

        function finishDirectEdit(save = true) {
            if (!currentInlineEditor) return;
            const { element, originalText, originalHTML } = currentInlineEditor;
            const newText = element.textContent;
            element.removeEventListener('keydown', handleDirectEditKeydown);
            element.removeEventListener('blur', handleDirectEditBlur);
            element.contentEditable = false;
            element.classList.remove('direct-editing');
            if (save && newText !== originalText) {
                debouncedSaveSnapshot();
            } else if (!save) {
                element.textContent = originalText;
            }
            currentInlineEditor = null;
        }

        function deleteSelected() {
            if (selectedElement) {
                selectedElement.remove();
                clearSelection();
                debouncedSaveSnapshot();
            }
        }

        function duplicateSelected() {
            if (selectedElement) {
                const clone = selectedElement.cloneNode(true);
                clone.classList.remove('quick-edit-element-selected');
                const left = parseFloat(selectedElement.style.left) || 0;
                const top = parseFloat(selectedElement.style.top) || 0;
                clone.style.left = (left + 20) + 'px';
                clone.style.top = (top + 20) + 'px';
                selectedElement.parentNode.appendChild(clone);
                selectElement(clone);
                debouncedSaveSnapshot();
            }
        }

        function moveUp() {
            if (selectedElement && selectedElement.parentNode) {
                const parent = selectedElement.parentNode;
                if (selectedElement.nextElementSibling) {
                    parent.insertBefore(selectedElement, selectedElement.nextElementSibling.nextSibling);
                } else {
                    parent.appendChild(selectedElement);
                }
                debouncedSaveSnapshot();
            }
        }

        function moveDown() {
            if (selectedElement && selectedElement.parentNode) {
                const parent = selectedElement.parentNode;
                if (selectedElement.previousElementSibling) {
                    parent.insertBefore(selectedElement, selectedElement.previousElementSibling);
                } else {
                    parent.insertBefore(selectedElement, parent.firstChild);
                }
                debouncedSaveSnapshot();
            }
        }

        function alignLeft() {
            if (selectedElement && selectedElement.parentNode) {
                const parentRect = selectedElement.parentNode.getBoundingClientRect();
                const elRect = selectedElement.getBoundingClientRect();
                const offsetLeft = elRect.left - parentRect.left;
                selectedElement.style.left = offsetLeft + 'px';
                updateResizeHandlesPosition(selectedElement);
                debouncedSaveSnapshot();
            }
        }

        function alignCenter() {
            if (selectedElement && selectedElement.parentNode) {
                const parentRect = selectedElement.parentNode.getBoundingClientRect();
                const elWidth = selectedElement.offsetWidth;
                const newLeft = (parentRect.width - elWidth) / 2;
                selectedElement.style.left = newLeft + 'px';
                updateResizeHandlesPosition(selectedElement);
                debouncedSaveSnapshot();
            }
        }

        function alignRight() {
            if (selectedElement && selectedElement.parentNode) {
                const parentRect = selectedElement.parentNode.getBoundingClientRect();
                const elWidth = selectedElement.offsetWidth;
                const newLeft = parentRect.width - elWidth;
                selectedElement.style.left = newLeft + 'px';
                updateResizeHandlesPosition(selectedElement);
                debouncedSaveSnapshot();
            }
        }

        function attachGlobalEditorEvents() {
            document.querySelectorAll('[data-editable="true"]').forEach(el => {
                el.removeEventListener('mousedown', onDragMouseDown);
                el.removeEventListener('dblclick', onDoubleClick);
                el.addEventListener('mousedown', onDragMouseDown);
                el.addEventListener('dblclick', onDoubleClick);
            });
            function onDoubleClick(e) {
                if (e.target.innerText !== undefined) {
                    e.stopPropagation();
                    makeElementDirectlyEditable(e.target);
                }
            }
            document.body.addEventListener('click', (e) => {
                if (!e.target.closest('[data-editable="true"]') && !e.target.closest('.editor-resize-handle')) {
                    clearSelection();
                } else if (e.target.closest('[data-editable="true"]') && !e.target.closest('.editor-resize-handle')) {
                    selectElement(e.target.closest('[data-editable="true"]'));
                }
            });
        }

        function initEditor() {
            document.querySelectorAll('p, div, img, span, h1, h2, h3, h4, h5, h6, button, a, svg, canvas').forEach(el => {
                if (!el.closest('.editor-resize-handle')) {
                    el.setAttribute('data-editable', 'true');
                }
            });
            attachGlobalEditorEvents();
            setupKeyboardShortcuts();
        }

        window.quickEditAPI = {
            deleteSelected, duplicateSelected, moveUp, moveDown,
            alignLeft, alignCenter, alignRight, clearSelection
        };
        
        window.addEventListener('message', (e) => {
            const { type, payload } = e.data;
            if (type === 'editor:command' && window.quickEditAPI[payload]) {
                window.quickEditAPI[payload]();
            }
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEditor);
        } else {
            initEditor();
        }
    })();
    `;
};

const editorStyle = `
<style>
    body {
        position: relative !important;
        margin: 0;
        padding: 0;
    }
    [data-editable="true"] {
        cursor: move;
        user-select: none;
        box-sizing: border-box;
    }
    .quick-edit-element-selected {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
        z-index: 9999;
    }
    .editor-resize-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        z-index: 10000;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        pointer-events: auto;
    }
    [contenteditable="true"] {
        cursor: text;
        background: rgba(255,255,200,0.6);
        outline: 2px solid #3b82f6;
    }
    .direct-editing {
        outline: 2px solid #4facfe !important;
        outline-offset: 2px !important;
        background: rgba(79, 172, 254, 0.1) !important;
        border-radius: 4px !important;
        padding: 2px 4px !important;
    }
</style>
`;

const injectQuickEditIntoHtml = (originalHtml: string): string => {
    if (originalHtml.includes('__quickEditInitialized')) return originalHtml;
    let modified = originalHtml.replace('</head>', `${editorStyle}</head>`);
    modified = modified.replace('</body>', `<script>${buildQuickEditScript()}</script></body>`);
    return modified;
};

// ---------- 历史记录 Reducer ----------
type HistoryState = {
    past: string[];
    present: string;
    future: string[];
};

type HistoryAction =
    | { type: 'PUSH'; newPresent: string }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'RESET'; initialState: string };

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
    switch (action.type) {
        case 'PUSH':
            if (state.present === action.newPresent) return state;
            return {
                past: [...state.past, state.present],
                present: action.newPresent,
                future: [],
            };
        case 'UNDO': {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);
            return {
                past: newPast,
                present: previous,
                future: [state.present, ...state.future],
            };
        }
        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return {
                past: [...state.past, state.present],
                present: next,
                future: newFuture,
            };
        }
        case 'RESET':
            return {
                past: [],
                present: action.initialState,
                future: [],
            };
        default:
            return state;
    }
};

export const PptxPreviewContainer = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editIframeRef = useRef<HTMLIFrameElement>(null);
    const editorPanelRef = useRef<HTMLDivElement>(null);
    const [iframeKey, setIframeKey] = useState(0);
    const lastPageIndex = useRef<number>(-1);

    // 实际渲染到编辑 iframe 中的 HTML
    const [currentEditHtml, setCurrentEditHtml] = useState('');

    const [historyState, dispatchHistory] = useReducer(historyReducer, {
        past: [],
        present: '',
        future: [],
    });

    const {
        isOpen,
        getPPTTitle,
        closePPTXPreviewContainer,
        getPPTSlideDataList,
        getPPTSlideDataByCurrentPageNumber,
        isFirstPage,
        isLastPage,
        currentPageIsEqualIndex,
        prevPage,
        nextPage,
        setPage,
        getCurrentPageProgressInSlideDataList,
        updateSlideHTML,
    } = usePPTXInfo();

    const getCurrentPageIndex = useCallback(() => {
        const list = getPPTSlideDataList?.() || [];
        for (let i = 0; i < list.length; i++) {
            if (currentPageIsEqualIndex?.(i)) return i;
        }
        return -1;
    }, [getPPTSlideDataList, currentPageIsEqualIndex]);

    const sendEditorCommand = useCallback((cmd: string) => {
        if (editIframeRef.current?.contentWindow) {
            editIframeRef.current.contentWindow.postMessage({ type: 'editor:command', payload: cmd }, '*');
        }
    }, []);

    // 保存快照（来自 iframe 的消息）—— 只更新历史，不重绘 iframe
    const saveSnapshot = useCallback((html: string) => {
        dispatchHistory({ type: 'PUSH', newPresent: html });
    }, []);

    // 撤销：更新 present 并重绘 iframe
    const undo = useCallback(() => {
        if (historyState.past.length === 0) return;
        const newPresent = historyState.past[historyState.past.length - 1];
        dispatchHistory({ type: 'UNDO' });
        setCurrentEditHtml(newPresent);
    }, [historyState.past]);

    // 重做：更新 present 并重绘 iframe
    const redo = useCallback(() => {
        if (historyState.future.length === 0) return;
        const newPresent = historyState.future[0];
        dispatchHistory({ type: 'REDO' });
        setCurrentEditHtml(newPresent);
    }, [historyState.future]);

    // 监听来自 iframe 的请求事件
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            const eventType = e.data.type;
            switch (eventType) {
                case 'editor:saveSnapshot' :
                    if (e.data.html) saveSnapshot(e.data.html);
                    break;
                case 'editor:undo': {
                    undo();
                    break;
                }
                case 'editor:redo': {
                    redo();
                    break;
                }
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [saveSnapshot, undo, redo]);

    // 打开编辑面板或切换页面时，重置历史并设置当前编辑 HTML
    useEffect(() => {
        if (!isEditing) return;
        const currentPage = getCurrentPageIndex();
        if (lastPageIndex.current !== currentPage) {
            lastPageIndex.current = currentPage;
            const rawHtml = getPPTSlideDataByCurrentPageNumber?.()?.htmlContent || '';
            const editableHtml = injectQuickEditIntoHtml(rawHtml);
            dispatchHistory({ type: 'RESET', initialState: editableHtml });
            setCurrentEditHtml(editableHtml);
            setIframeKey(prev => prev + 1);
        }
    }, [isEditing, getCurrentPageIndex, getPPTSlideDataByCurrentPageNumber]);

    // 点击编辑面板空白区域（非 iframe 内部、非工具栏）清除选中边框
    useEffect(() => {
        if (!isEditing) return;

        const handleOutsideClick = (e: MouseEvent) => {
            // 如果点击在 iframe 内部，忽略
            if (editIframeRef.current?.contentWindow?.document?.body?.contains(e.target as Node)) {
                return;
            }
            // 如果点击在工具栏内，忽略（让按钮可以正常工作）
            const toolbar = document.querySelector('.editor-toolbar');
            if (toolbar && toolbar.contains(e.target as Node)) {
                return;
            }
            sendEditorCommand('clearSelection');
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isEditing, sendEditorCommand]);

    const saveEditResult = async () => {
        if (editIframeRef.current?.contentWindow) {
            const editedDoc = editIframeRef.current.contentWindow.document;
            const editedHtml = '<!DOCTYPE html>' + editedDoc.documentElement.outerHTML;
            if (updateSlideHTML) {
                await updateSlideHTML(editedHtml);
            } else {
                console.warn('updateSlideHTML not implemented in store');
            }
        }
        setIsEditing(false);
    };

    const canUndo = historyState.past.length > 0;
    const canRedo = historyState.future.length > 0;

    if (!isOpen?.()) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2026] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={closePPTXPreviewContainer}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative z-[2026] max-lg:min-w-[75vw] max-lg:w-[75vw] max-lg:max-w-[75vw] lg:min-w-[75vw] lg:w-[52vw] lg:max-w-[75vw] xl:min-w-[75vw] xl:w-[75vw] xl:max-w-[75vw] 2xl:min-w-[75vw] 2xl:w-[75vw] 2xl:max-w-[75vw] max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-white"
                >
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center shadow-md">
                                <Presentation size={16} />
                            </div>
                            <span className="font-medium truncate max-w-[40vw]">{getPPTTitle?.()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsFullScreen(true)} className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-1 group text-emerald-400" title="全屏播放">
                                <Play size={18} fill="currentColor" />
                            </button>
                            <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-1 group" title={isEditing ? "退出编辑" : "编辑内容"}>
                                <Edit size={18} className={isEditing ? "text-orange-400" : "group-hover:text-orange-400 transition-colors"} />
                            </button>
                            {isEditing && (
                                <button onClick={saveEditResult} className="p-2 hover:bg-emerald-500 rounded-full transition-all flex items-center gap-1 text-emerald-400">
                                    <Save size={18} />
                                </button>
                            )}
                            <button className="p-2 hover:bg-white/10 rounded-full transition-all"><Share2 size={18} /></button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-all"><Download size={18} /></button>
                            <div className="w-px h-4 bg-white/20 mx-1" />
                            <button onClick={closePPTXPreviewContainer} className="p-2 hover:bg-red-500 rounded-full transition-all">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden relative">
                        <div className="flex-1 relative bg-slate-100 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden relative">
                                <iframe
                                    srcDoc={getPPTSlideDataByCurrentPageNumber?.()?.htmlContent}
                                    className="w-full h-full border-0"
                                    title="main-slide"
                                />
                                <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center group/nav z-20">
                                    <button onClick={() => prevPage?.()} disabled={isFirstPage?.()} className="p-3 bg-white/80 hover:bg-white rounded-full shadow-md text-slate-800 disabled:opacity-0 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform hover:scale-110">
                                        <ChevronLeft size={24} />
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center group/nav z-20">
                                    <button onClick={() => nextPage?.()} disabled={isLastPage?.()} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md disabled:opacity-0 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform hover:scale-110">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-1 bg-slate-200 relative flex-shrink-0">
                            <div className="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-500" style={{ height: `${(getCurrentPageProgressInSlideDataList?.() || 0) * 100}%` }} />
                        </div>

                        <div className="w-[260px] bg-slate-50 flex flex-col border-l border-slate-200 overflow-y-auto p-4 gap-4 scroll-smooth custom-scrollbar">
                            {getPPTSlideDataList?.().map((slideData: SlideData, i: number) => {
                                const isSelected = currentPageIsEqualIndex?.(i);
                                const pageTitle = slideData?.title || `第 ${i + 1} 页`;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setPage?.(i)}
                                        onDoubleClick={() => { setPage?.(i); setIsFullScreen(true); }}
                                        title={pageTitle}
                                        className={`flex-shrink-0 w-full rounded-xl border-2 transition-all cursor-pointer flex flex-col bg-white overflow-hidden shadow-sm ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-300'}`}
                                    >
                                        <div className="w-full aspect-[16/10] bg-white overflow-hidden relative border-b border-slate-100">
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <iframe
                                                    srcDoc={slideData?.htmlContent}
                                                    title={`thumb-${i}`}
                                                    sandbox="allow-scripts"
                                                    style={{
                                                        width: `${VIRTUAL_WIDTH}px`,
                                                        height: `${VIRTUAL_HEIGHT}px`,
                                                        border: 'none',
                                                        pointerEvents: 'none',
                                                        transform: `scale(${SCALE * (228 / THUMB_WIDTH)})`,
                                                        transformOrigin: 'top left',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0
                                                    }}
                                                />
                                                <div className="absolute inset-0 z-10" />
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 bg-white">
                                            <p className={`text-[12px] font-medium truncate ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                {i + 1}. {pageTitle}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    ref={editorPanelRef}
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                    className="fixed inset-0 z-[50] bg-white flex flex-col shadow-2xl"
                                >
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Edit size={18} className="text-indigo-600" />
                                            <span className="font-semibold text-slate-800">
                                                编辑内容 - {getPPTSlideDataByCurrentPageNumber?.()?.title || `第 ${Math.floor((getCurrentPageProgressInSlideDataList?.() || 0) * (getPPTSlideDataList?.().length || 1)) + 1} 页`}
                                            </span>
                                        </div>
                                        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="editor-toolbar flex items-center gap-1 px-6 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto">
                                        <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-30" title="撤销 (Ctrl+Z)"><Undo2 size={18} /></button>
                                        <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-30" title="重做 (Ctrl+Y)"><Redo2 size={18} /></button>
                                        <div className="w-px h-6 bg-slate-300 mx-2" />
                                        <button onClick={() => sendEditorCommand('deleteSelected')} className="p-2 rounded-md hover:bg-red-100 text-red-600" title="删除元素"><Trash2 size={18} /></button>
                                        <button onClick={() => sendEditorCommand('duplicateSelected')} className="p-2 rounded-md hover:bg-slate-200" title="复制元素"><Copy size={18} /></button>
                                        <div className="w-px h-6 bg-slate-300 mx-2" />
                                        <button onClick={() => sendEditorCommand('moveUp')} className="p-2 rounded-md hover:bg-slate-200" title="上移层级"><BringToFront size={18} /></button>
                                        <button onClick={() => sendEditorCommand('moveDown')} className="p-2 rounded-md hover:bg-slate-200" title="下移层级"><SendToBack size={18} /></button>
                                        <div className="w-px h-6 bg-slate-300 mx-2" />
                                        <button onClick={() => sendEditorCommand('alignLeft')} className="p-2 rounded-md hover:bg-slate-200" title="左对齐"><AlignLeft size={18} /></button>
                                        <button onClick={() => sendEditorCommand('alignCenter')} className="p-2 rounded-md hover:bg-slate-200" title="居中对齐"><AlignCenter size={18} /></button>
                                        <button onClick={() => sendEditorCommand('alignRight')} className="p-2 rounded-md hover:bg-slate-200" title="右对齐"><AlignRight size={18} /></button>
                                    </div>

                                    <div className="flex-1 overflow-auto bg-slate-100">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <iframe
                                                key={iframeKey}
                                                ref={editIframeRef}
                                                srcDoc={currentEditHtml}
                                                title="editor-canvas"
                                                className="border-0 shadow-lg"
                                                sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
                                                style={{ width: '100%', height: '100%', minHeight: '600px' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isFullScreen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[3000] bg-black flex items-center justify-center group/player"
                                >
                                    <iframe
                                        srcDoc={getPPTSlideDataByCurrentPageNumber?.()?.htmlContent}
                                        className="w-full h-full border-0 select-none"
                                        title="fullscreen-slide"
                                    />
                                    <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-center group/nav-fs z-[3001]">
                                        <button onClick={() => prevPage?.()} disabled={isFirstPage?.()} className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full disabled:hidden opacity-0 group-hover/nav-fs:opacity-100 transition-all">
                                            <ChevronLeft size={48} />
                                        </button>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-center group/nav-fs z-[3001]">
                                        <button onClick={() => { if (isLastPage?.()) setIsFullScreen(false); else nextPage?.(); }} className="p-5 bg-white/10 hover:bg-white/20 text-white rounded-full opacity-0 group-hover/nav-fs:opacity-100 transition-all">
                                            <ChevronRight size={48} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 text-white/50 text-sm rounded-full opacity-0 group-hover/player:opacity-100 transition-opacity">
                                        {(getPPTSlideDataList()?.findIndex((_: any, i: number) => currentPageIsEqualIndex?.(i)) ?? 0) + 1} / {getPPTSlideDataList()?.length}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
