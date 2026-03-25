import {EditorContent, useEditor, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {BubbleMenu, FloatingMenu} from "@tiptap/react/menus";
import {useMemo} from "react";

export const ETipTap = () => {
    const editor = useEditor({
        extensions: [StarterKit], // define your extension array
        content: '<p>Hello World!</p>', // initial content
    })
    // Memoize the provider value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor]);
    return (
        <EditorContext.Provider value={providerValue}>
            <EditorContent editor={editor} />
            <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
            <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
        </EditorContext.Provider>
    )
}
