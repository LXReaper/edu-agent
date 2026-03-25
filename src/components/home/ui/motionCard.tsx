import React from "react";
import {motion} from "motion/react";
import {CssVariableNames} from "../../../lib";
import type {MotionCardProps} from "../../../type";
import type {Transition} from "motion";
import {MotionCardInitial} from "../../../constants";

const cardStyles = {
    borderRadius: '1rem',
    boxShadow: `0 25px 50px -12px ${CssVariableNames.borderColor}`, // 强阴影
    overflow: 'hidden', // 确保内部视频/图片不会溢出
};
export const MotionCard: React.FC<MotionCardProps> = ({
    component,

    motionCardInitial = MotionCardInitial.leftIn,
    motionCardWhileHover = MotionCardInitial.rightCenterEnd,

    transitionType = 'spring',
    transitionStiffness = 200,
    transitionDamping = 50,

}) => {

    return (
        <motion.div
            className="transform-gpu"
            style={{perspective: 1000}}
        >
            <motion.div
                className={`relative w-[100%] h-[100%] bg-gray-900`}
                style={cardStyles}

                // 初始状态
                initial={motionCardInitial}
                // 悬停状态：旋转归零，正对用户
                whileHover={motionCardWhileHover}

                transition={{
                    type: transitionType,
                    stiffness: transitionStiffness,
                    damping: transitionDamping
                } as Transition}
            >
                {component}
            </motion.div>
        </motion.div>
    )
}
