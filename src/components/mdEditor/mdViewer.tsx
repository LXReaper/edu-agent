import {Viewer} from "@bytemd/react";
import gfm from '@bytemd/plugin-gfm'
import highlight from "@bytemd/plugin-highlight";
import React from "react";
import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import highlightSsr from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math";
import mathSsr from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";

interface MdViewerProps {
    content: string;
}

export const MdViewer: React.FC<MdViewerProps> = ({
    content,
}) => {
    const plugins = [
        breaks(),
        frontmatter(),
        gemoji(),
        gfm(),
        highlight(),
        highlightSsr(),
        math(),
        mathSsr(),
        mediumZoom(),
        mermaid(),
    ];
    return (
        <div className={`relative`}>
            <Viewer value={content} plugins={plugins} />
        </div>
    )
}
