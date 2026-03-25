export type ChatSessionConfig = {
    // id
    id: string;
    // 用户id
    userId: number;
    // 当前chat session的标题
    title: string;
    // 具体模型名称
    modelName: string;
    // 每一个发给LLM请求的元数据（spring ai中自定义 advisor 参数）
    metadata: object;
    // 最大生成tokens数
    maxTokens: number;
    // 生成温度
    temperature: number;
    // 是否流式输出
    stream: boolean;
    // 创建时间
    createTime: Date;
    // 更新时间
    updateTime: Date;
}

