import {CssVariableNames} from "../../../lib";
import {motion} from "motion/react";
import {MotionCard} from "../ui/motionCard.tsx";
import React from "react";
import {FadeInUpVariant, MotionCardInitial} from "../../../constants";
import type {TargetAndTransition, VariantLabels} from "motion-dom";

const heroVideoPostUrl = import.meta.env.VITE_HERO_SECTION_VIDEO_POST_URL;
const heroVideoUrl = import.meta.env.VITE_HERO_SECTION_VIDEO_URL;

type FeatureIntroductionsType = {
    contentShowLeft: boolean;
    content: string;
    videoSrc: string;
    videoPost: string;
    desktopMotionCardInitial: TargetAndTransition | VariantLabels | boolean;
    desktopMotionCardWhileHover: VariantLabels | TargetAndTransition;
}

const featureIntroductions: Array<FeatureIntroductionsType> = [
    {
        contentShowLeft: true,// 文字是否显示在左侧
        content: `<h2 class="leading-normal text-[36px]">Create your own AI model</h2>
                <p class="text-[18px] overflow-hidden">
                    Create lifelike and realistic photos of yourself (or an influencer you work for) by creating your
                    own AI model. Upload a set of just 10 to 20 photos in a diverse range of places, settings, and
                    times. Press
                    <span class="border-2 border-[${CssVariableNames.foregroundColor}] font-bold rounded-xl inline-block p-2.5 leading-none
                        mx-1.5 cursor-pointer text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}] m-0.5">
                        ✚ Create new AI model
                    </span>
                    and it starts training your model. By inputting these images into your model, you're teaching it to
                    recognize and replicate
                    it.<br/><br/>
                    You only need to create your AI model once which takes about 5 minutes. Photo AI use the highest
                    quality training with the highest possible steps which takes more GPU cycles (and thus time and
                    cost).<br/>
                    <br/>
                    After your AI model is done, you can take infinite photos with it fast!
                </p>`,
        videoSrc: heroVideoUrl || "",
        videoPost: heroVideoPostUrl || "",
        desktopMotionCardInitial: MotionCardInitial.leftIn,
        desktopMotionCardWhileHover: MotionCardInitial.leftCenterEnd,
    },
    {
        contentShowLeft: false,// 文字是否显示在左侧
        content: `
            <h2 class="leading-normal text-[36px]">Create AI videos</h2>
            <p class="text-[18px] overflow-hidden">
                Take any AI photo you generated, and turn it into a video by tapping 
                <span class="border-2 border-[${CssVariableNames.foregroundColor}] font-bold rounded-xl inline-block p-2.5 leading-none
                        mx-1.5 cursor-pointer text-[${CssVariableNames.backgroundColor}] bg-[${CssVariableNames.foregroundColor}] m-0.5">
                        🎥 Make video
                </span>
                A few minutes later you have a short video clip of the photo giving you an immersive virtual
                reality like experience.<br/><br/>
                You can even add a talking script to make your AI model talk! The video on the side here is 100%
                AI and created with Photo AI.
                <br/>
                Next features we'll add is boomerang videos, background audio and music and longer 10-30 second
                clips.
            </p>
        `,
        videoSrc: heroVideoUrl || "",
        videoPost: heroVideoPostUrl || "",
        desktopMotionCardInitial: MotionCardInitial.rightIn,
        desktopMotionCardWhileHover: MotionCardInitial.rightCenterEnd,
    }
]

export const FeatureSection = () => {
    return (
        <div className={`relative bg-[${CssVariableNames.backgroundColor}] flex justify-center flex-wrap
                text-[${CssVariableNames.foregroundColor}] font-sans overflow-hidden gap-[3%]`}>
            {featureIntroductions.map((feature) => (
                <>
                    {!feature.contentShowLeft &&
                        <motion.div
                            variants={FadeInUpVariant}
                            initial={{opacity: 0, y: 50}}  // 初始状态透明且下移50px
                            whileInView={{opacity: 1, y: 0}} // 进入视口时变为不透明并回到原位置
                            viewport={{once: true}} // 仅触发一次
                            transition={{duration: 1, delay: 0.3}} // 动画时长
                            className={`flex items-center min-h-[50vh] my-[5vh] rounded-[15px] overflow-hidden`}
                        >
                            <MotionCard
                                component={<video width={550} height={550} className={`object-cover max-md:hidden`}
                                                  controls={true} poster={feature.videoPost}
                                                  src={feature.videoSrc}></video>}
                                motionCardInitial={feature.desktopMotionCardInitial}
                                motionCardWhileHover={feature.desktopMotionCardWhileHover}
                            />
                        </motion.div>
                    }
                    {/*文本文字*/}
                    <motion.div
                        variants={FadeInUpVariant}
                        initial={{opacity: 0, y: 50}}  // 初始状态透明且下移50px
                        whileInView={{opacity: 1, y: 0}} // 进入视口时变为不透明并回到原位置
                        viewport={{once: true}} // 仅触发一次
                        transition={{duration: 1, delay: 0.5}} // 动画时长
                        className={`md:w-[50%] max-md:w-[85%] h-[70%] max-h-[70%] my-[5vh]`}
                        dangerouslySetInnerHTML={{__html: feature.content}}
                    >
                    </motion.div>
                    <motion.div
                        variants={FadeInUpVariant}
                        initial={{opacity: 0, y: 50}}  // 初始状态透明且下移50px
                        whileInView={{opacity: 1, y: 0}} // 进入视口时变为不透明并回到原位置
                        viewport={{once: true}} // 仅触发一次
                        transition={{duration: 1, delay: 0.3}} // 动画时长
                        className={`flex items-center min-h-[50vh] my-[5vh] rounded-[15px] overflow-hidden`}
                    >
                        {feature.contentShowLeft &&
                            <MotionCard
                                component={<video width={550} height={550} className={`object-cover max-md:hidden`}
                                                  controls={true} poster={feature.videoPost}
                                                  src={feature.videoSrc}></video>}
                                motionCardInitial={feature.desktopMotionCardInitial}
                                motionCardWhileHover={feature.desktopMotionCardWhileHover}
                            />
                        }
                        <MotionCard
                            component={<video className={`object-cover md:hidden max-w-[95vw] max-h-[500px]`}
                                              controls={true} poster={feature.videoPost}
                                              src={feature.videoSrc}></video>}
                            motionCardInitial={MotionCardInitial.none}
                            motionCardWhileHover={MotionCardInitial.none}
                        />
                    </motion.div>
                </>
            ))}

        </div>
    )
}
