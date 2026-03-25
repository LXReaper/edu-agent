export type AgentEventResponseCoreContent = {
    stepProgressId?: number;// 如果当前是流式输出文字信息，那么就有这个ID
    content: string;// 可以是某个对象，内容
    message: string;// 纯字符串文本，消息
}
