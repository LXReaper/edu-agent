export type EdChatSessionConfigCreateRequest = {
    userId: number;
    title: string;
    modelName: string;
    metadata: object;
    maxTokens: number;
    temperature: number;
    stream: boolean;
}
