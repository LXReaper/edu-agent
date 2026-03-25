export type BaiduAISearchResponse = {
    requestId: string;

    isSafe?: boolean;
    choices?: Choice[];
    code?: string;
    message?: string;
    usage?: Usage;
    references: Reference[];
    followupQueries?: string[];
}

export type Choice = {
    index: number;
    finishReason: string;
    message: ChoiceMessage;
    delta: Delta;
}

export type ChoiceMessage = {
    content: string;
    role: string;
    reasoningContent: string;
}

export type Delta = {
    content: string;
    role: string;
    reasoningContent: string;
}

export type Usage = {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
}

export type Reference = {
    id: number;
    title: string;
    url: string;
    webAnchor: string;
    icon: string;
    content: string;
    date: string;
    type: string;
    image?: ImageDetail;
    video?: VideoDetail;
}
export enum BaiduAISearchReferenceType {
    WEB = "web",
    IMAGE = "image",
    VIDEO = "video",
}

export type ImageDetail = {
    url: string;
    height: string;
    width: string;
}

export type VideoDetail = {
    url: string;
    height: string;
    width: string;
    size: string;
    duration: string;
    hoverPic: string;
}
