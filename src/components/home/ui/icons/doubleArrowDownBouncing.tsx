import React from 'react';
import { motion } from 'framer-motion';
import {CssVariableNames} from "../../../../lib";

export const DoubleArrowDownBouncing: React.FC = () => {
    return (
        <motion.div
            className={`flex flex-col items-center justify-center space-y-1 text-[${CssVariableNames.foregroundColor}]`}
            initial={{y: -2}}
            animate={{y: [-2, 0, -2]}} // 动画方向改为向下 0 -> 10 -> 0，更符合向下箭头的视觉
            transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{
                fontSize: '2rem', // 实际大小由 SVG 的 w-h 控制
            }}
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                width={24} height={24} className="lucide lucide-chevrons-down-icon lucide-chevrons-down"
            >
                <path d="m7 6 5 5 5-5"/>
                <path d="m7 13 5 5 5-5"/>
            </motion.svg>
        </motion.div>
    );
};
