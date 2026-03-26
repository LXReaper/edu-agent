import {AgentEventTypeEnum} from "../enums/AgentEventTypeEnum.ts";
import type {TodoStep} from "../TodoStep.ts";

export type AgentEventResponse = {
    // 当前聊天消息的Id
    curChatSessionHistoryId: number;
    // 当前聊天消息的父消息Id
    chatSessionHistoryRootId: number;
    // 当前消息来自的子Agent的Id
    agentId: string;
    // 当前聊天会话Id
    chatSessionId: string;
    userId: number;// 当前聊天的用户Id
    eventType: AgentEventTypeEnum;
    message: string;// 纯字符串文本，消息
    todoStep: TodoStep;
    content: string;// 可以是某个对象，内容
    eventDate: Date;
}
