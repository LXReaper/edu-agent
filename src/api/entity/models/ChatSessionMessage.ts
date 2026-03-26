import type {LLMMessageRoleEnum} from "../enums/LLMMessageRoleEnum.ts";
import type {AgentEventTypeEnum} from "../enums/AgentEventTypeEnum.ts";

export type ChatSessionMessage = {
    id: number;// id
    sessionId: string;// ed_chat_session_config的id
    userId: number;// 用户id
    messageRole: LLMMessageRoleEnum;// 消息角色类型，具体参考LLMMessageRole定义的
    content: string;// 消息文本
    eventType?: AgentEventTypeEnum;// 消息事件类型，具体参考AgentEventTypeEnum定义的
    metadata?: any;// 特殊属性
    sequenceNumber: number;// 序列号
    chatSessionHistoryRootId?: number;// 当前聊天会话消息的父消息的id
    agentId: string;// 当前消息的agentId
    createTime: Date;// 创建时间
    updateTime: Date;// 更新时间
}
