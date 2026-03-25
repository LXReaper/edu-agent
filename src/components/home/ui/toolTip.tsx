'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {CssVariableNames} from "../../../lib";

type ArrowDirection = 'top' | 'bottom' | 'left' | 'right';
interface DirectionalTooltipArrowProps {
    /** 箭头的指向，决定了它的旋转和定位 */
    direction: ArrowDirection;
    /** 箭头的主体颜色 */
    color?: string;
    /** 是否显示箭头 */
    isShowArrow?: boolean;
}
// 映射：根据箭头的指向，确定外部容器的旋转和定位类
const directionMap: Record<ArrowDirection, string> = {
    // 箭头在工具提示的底部，尖端朝上
    top: 'rotate-45 -top-[5px] left-1/2 -translate-x-1/2',

    // 箭头在工具提示的顶部，尖端朝下 (默认方向)
    bottom: 'rotate-45 -bottom-[5px] left-1/2 -translate-x-1/2',

    // 箭头在工具提示的右侧，尖端朝左
    left: '-rotate-45 top-1/2 -translate-y-1/2 -left-[5px]',

    // 箭头在工具提示的左侧，尖端朝右
    right: '-rotate-45 top-1/2 -translate-y-1/2 -right-[5px]',
};



const TooltipProvider = ({
    delayDuration = 0,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    );
}

const Tooltip = ({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

const TooltipTrigger = ({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const TooltipContent = ({
    className,
    sideOffset = 0,
    children,
    direction: direction,
    color: color,
    isShowArrow = true,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & DirectionalTooltipArrowProps) => {
    const position = directionMap[direction] || directionMap.bottom;
    const arrowColor = color ?? CssVariableNames.foregroundColor;
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={
                    `text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out 
                    data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                    data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 
                    data-[side=top]:slide-in-from-bottom-2 z-[2025] w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5
                    text-xs text-balance ${className}`
                }
                {...props}
            >
                {children}
                {isShowArrow && <div
                    // 基础容器：定位、尺寸、旋转
                    className={`
                        absolute z-50 
                        size-2.5 
                        
                        /* 定位 */
                        ${position}
                    `}
                >
                    <div
                        // 箭头主体
                        className={`
                            w-full h-full 
                            rounded-[2px] 
                            bg-[${arrowColor}]
                            shadow-md 
                        `}
                    />
                </div>}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider};
