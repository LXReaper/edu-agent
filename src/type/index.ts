import React from "react";
import type {TargetAndTransition, VariantLabels} from "motion-dom";
import type {AlertProps} from "antd/lib/alert";
import {LLMMessageRoleEnum} from "../api/entity/enums/LLMMessageRoleEnum.ts";
import {AgentEventTypeEnum} from "../api/entity/enums/AgentEventTypeEnum.ts";
import type {TodoStep} from "../api/entity/TodoStep.ts";
import type {ChatSessionMessage} from "../api/entity/models/ChatSessionMessage.ts";

export interface MotionCardProps {
    component: React.ReactNode;

    motionCardInitial?: TargetAndTransition | VariantLabels | boolean;
    motionCardWhileHover?: VariantLabels | TargetAndTransition;

    transitionType?: string;
    transitionStiffness?: number;
    transitionDamping?: number;
}
export interface IAlertProps extends AlertProps {
    message: string; // 消息内容
    description?: string; // 描述内容（可选）
    type?: 'success' | 'info' | 'warning' | 'error';
    showIcon?: boolean; // 是否显示图标（可选）
    banner?: boolean;// 是否显示顶部公告（可选）
}
export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}
export interface Ripple {
    id: string;
    x: number;
    y: number;
    color?: string;
}

export type MessageContainer = {
    userMessage: ChatSessionMessage;
    assistantMessages: ChatSessionMessage[];
}

export enum StepsStatusEnum {
    RUNNING = "running",
    DONE = "done",
    ERROR = "error",
    RESTARTED = "restarted",
}
export type StepContainer = {
    status: StepsStatusEnum;
    stepMessages: ChatSessionMessage[];
}

export type ThoughtStep = {
    id: string;
    type: AgentEventTypeEnum | undefined;
    content: string;
    createTime: Date;
    sequenceNumber?: number;
    meta?: {
        skillNames?: string[];
        todoSteps?: TodoStep[];
        curStep?: TodoStep;
    }
}

export enum StepTypeEnum {// 步骤类型的枚举
    SEARCH = "search",
    PPT_GENERATION = "ppt_generation",
    WORD_DOC_GENERATION = "word_doc_generation",
    DATA_ANALYSIS = "data_analysis",
    SUMMARY = "summary",
}
export const ToolName2StepType = {
    webSearch: StepTypeEnum.SEARCH,
}

export type ChatContentItem = {
    type: LLMMessageRoleEnum;
    content: string;
}
export enum ChatReportExeState {// 聊天报告生成的状态
    IS_BEING_EXECUTED = "is_being_executed",// 正在执行
    EXECUTE_ERROR = "execute_error",// 执行失败
    EXECUTE_FINISH = "execute_finish",// 执行完成
}
