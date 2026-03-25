import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import React from "react";
import StarterKit from "@tiptap/starter-kit";
interface TipTapMdViewerProps {
    content: string;
}

export const TipTapMdViewer: React.FC<TipTapMdViewerProps> = ({
    content,
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            // Document,
            // Paragraph,
            // Text,
            // Code,
            // Typography
        ],
        content: content,
    })
    return <><EditorContent editor={editor} /></>
}
