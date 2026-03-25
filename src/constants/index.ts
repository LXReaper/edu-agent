import type {Variants} from "motion-dom";
import {AgentEventTypeEnum} from "../api/entity/enums/AgentEventTypeEnum.ts";

export const GlobalRouterPath = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    DASHBOARD_DETAIL: "/dashboard/:id",
    AUTH: "/auth",
    ABOUT: "/about",
    PRICING: "/pricing",
    APPLICATION: "/application",
    DOCS: "/documentation",

    // tools
    IMAGE_REMOVE_BG: "/imageRemoveBg",
    IMAGE_IN_PAINT: "/imageInpaint",
    IMAGE_ENHANCE: "/imageEnhance",
    VIDEO_ENHANCE: "/videoEnhance",
    IMAGE_COMPRESSOR: "/imageCompressor",
    VIDEO_CONVERT: "/videoConvert",
}
export const siteConfig = {
    name: 'Teadgen',
    description: 'The Generalist AI Worker that can act on your behalf.',
    githubName: "kortix-ai",// github用户名
    repository: "suna",// 仓库名称
    logo: "/logo.ico",
    webWhiteNameLogo: "/Teadgen_white.svg",
    webBlackNameLogo: "/Teadgen_black.svg",
    loginContainerImg: "/images/loginContainerImg.webp",
    cta: 'Start Free',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    keywords: ['AI Worker', 'Generalist AI', 'Open Source AI', 'Autonomous Agent'],
    links: {
        // email: '1@qq.com',
        twitter: 'https://x.com/yu_yyp76612',
        // discord: 'https://discord.gg/LXReaper',
        github: 'https://github.com/LXReaper/edu-agent',
        instagram: 'https://instagram.com/LXReaper_',
    },
    nav: {
        links: [
            { id: 1, name: 'Home', href: GlobalRouterPath.HOME },
            { id: 2, name: 'Process', href: '#process' },
            // { id: 3, name: 'Use Cases', href: '#use-cases' },
            { id: 4, name: 'Open Source', href: '#open-source' },
            { id: 5, name: 'Pricing', href: '#pricing' },
            { id: 6, name: 'Enterprise', href: '/enterprise' },
        ],
    },
}

export const MotionCardInitial = {
    none: {},
    leftIn: { rotateY: -20, rotateX: 0, transformOrigin: 'right center' },
    rightIn: { rotateY: 20, rotateX: 0, transformOrigin: 'left center' },

    leftCenterEnd: { rotateY: 0, rotateX: 0, transformOrigin: 'right center' },
    rightCenterEnd: { rotateY: 0, rotateX: 0, transformOrigin: 'left center' },
}


/*-----------------------<< motion标签中的特效，Variants参数 >>----------------------------------*/
// 渐显动画
export const FadeInUpVariant: Variants = {
    hidden: {opacity: 0, y: 50},
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay: i * 0.2 + 0.3, // 0.3s base delay + sequential delay
            ease: "easeOut",
        },
    }),
};
// 渐显+上浮动画
export const FadeInFloatUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.2, 0.8, 0.3, 1]
        }
    }
}
// 液态变形
export const LiquidTitle: Variants = {
    hidden: {
        filter: "blur(10px)",
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
    },
    visible: {
        filter: "blur(0px)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: {
            duration: 2,
            ease: "anticipate"
        }
    }
}

/*-----------------------<< motion标签中的特效，transition参数 >>----------------------------------*/
export const AsideTransition = {
    type: 'spring' as const,
    stiffness: 150,
    damping: 20,
    mass: 1
};


/*-----------------------<< agent发送回来的消息事件类型检验 >>----------------------------------*/
// 步骤执行的消息事件类型
export const ValidStepMessageTypes: AgentEventTypeEnum[] = [
    AgentEventTypeEnum.STEP_START,
    AgentEventTypeEnum.STEP_RESTART,
    AgentEventTypeEnum.STEP_PROGRESS,
    AgentEventTypeEnum.STEP_PROGRESS_DONE,
    AgentEventTypeEnum.STEP_PROGRESS_ERROR,
    AgentEventTypeEnum.STEP_DONE,
    AgentEventTypeEnum.TOOL_CALL,
    AgentEventTypeEnum.TOOL_RESULT,
];

// Agent思考的消息事件类型
export const ValidPlanEventTypes: AgentEventTypeEnum[] = [
    AgentEventTypeEnum.THINKING,
    AgentEventTypeEnum.THINKING_DONE,
    AgentEventTypeEnum.SKILLS_NEEDED,
    AgentEventTypeEnum.TASK_REASONING,
    AgentEventTypeEnum.TODO_STEP_GET
];
