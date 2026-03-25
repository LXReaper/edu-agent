import {create} from 'zustand';
import type {StepContainer} from "../../type";
import {StepsStatusEnum} from "../../type";
import type {ChatSessionMessage} from "../../api/entity/models/ChatSessionMessage.ts";
import {AgentEventTypeEnum} from "../../api/entity/enums/AgentEventTypeEnum.ts";
import type {AgentEventResponseCoreContent} from "../../api/entity/AgentEventResponseCoreContent.ts";

// 当前打开的report面板内显示的数据
// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    stepsContainer: StepContainer[];
};

type Action = {
    updateStepsContainer: (updater: (prev: StepContainer[]) => StepContainer[]) => void;
    getStepsContainerLength: () => number;
    getSteps: (index: number) => StepContainer;
    addStepMessageInStepContainer: (index: number, newMessage: ChatSessionMessage) => void;
    addStepMessageInLastStepContainer: (newMessage: ChatSessionMessage) => void;
    updateStatusInStepContainer: (index: number, status: StepsStatusEnum) => void;
    updateStatusInLastStepContainer: (status: StepsStatusEnum) => void;
    updateLastStepContainer: (status: StepsStatusEnum, newMessage: ChatSessionMessage) => void;

    // 最新的StepContainer
    isContainStepProgress: (stepProgressId: number) => boolean;
    updateStepProgressStepMessage: (newMessage: ChatSessionMessage) => void;

    stepsContainerUpdate: (eventType: AgentEventTypeEnum, message: ChatSessionMessage) => void;
    clearStepsContainer: () => void;
}

export const useCurReportStepsInfoStore = create<State & Action>((setState, getState) => ({
    stepsContainer: [],
    updateStepsContainer: (updater) => setState(state => ({
        stepsContainer: updater(state.stepsContainer)
    })),
    getStepsContainerLength: () => {
        const state = getState();
        if (!state) return 0;
        return state.stepsContainer.length;
    },
    getSteps: (index: number) => {
        const state = getState();
        if (!state) return null;
        return state.stepsContainer[index];
    },
    addStepMessageInStepContainer: (index: number, newMessage: ChatSessionMessage) => {
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === index ?
                    {
                        ...step,
                        stepMessages: [...step.stepMessages, newMessage]
                    } : step
            )
        }));
    },
    addStepMessageInLastStepContainer: (newMessage: ChatSessionMessage) => {
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === state.stepsContainer.length - 1 ?
                    {
                        ...step,
                        stepMessages: [...step.stepMessages, newMessage]
                    } : step
            )
        }));
    },
    updateStatusInStepContainer: (index: number, status: StepsStatusEnum) => {
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === index ?
                    {
                        ...step,
                        status: status
                    } : step
            )
        }));
    },
    updateStatusInLastStepContainer: (status: StepsStatusEnum) => {
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === state.stepsContainer.length - 1 ?
                    {
                        ...step,
                        status: status
                    } : step
            )
        }));
    },
    updateLastStepContainer: (status: StepsStatusEnum, newMessage: ChatSessionMessage) => {
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === state.stepsContainer.length - 1 ?
                    {
                        ...step,
                        status: status,
                        stepMessages: [...step.stepMessages, newMessage]
                    } : step
            )
        }));
    },

    isContainStepProgress: (stepProgressId: number) => {
        const state = getState();
        if (!state) return false;
        const step = state.stepsContainer[state.stepsContainer.length - 1];
        const stepMessages = step.stepMessages;
        for (const stepMessage of stepMessages) {
            if (stepMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                const coreContent = JSON.parse(stepMessage.content) as AgentEventResponseCoreContent;
                if (stepProgressId === coreContent.stepProgressId) {
                    return true;
                }
            }
        }
    },
    updateStepProgressStepMessage: (newMessage: ChatSessionMessage) => {
        const agentEventResponseCoreContent = JSON.parse(newMessage.content) as AgentEventResponseCoreContent;
        setState(state => ({
            stepsContainer: state.stepsContainer.map((step, i) =>
                i === state.stepsContainer.length - 1 ?
                    {
                        ...step,
                        stepMessages: step.stepMessages.map((stepMessage: ChatSessionMessage) => {
                            if (stepMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                                const coreContent = JSON.parse(stepMessage.content) as AgentEventResponseCoreContent;
                                if (agentEventResponseCoreContent.stepProgressId === coreContent.stepProgressId) {
                                    return newMessage;
                                }
                            }
                            return stepMessage;
                        })
                    } : step
            )
        }));
    },

    stepsContainerUpdate: (eventType: AgentEventTypeEnum, message: ChatSessionMessage) => {
        const state = getState();
        if (!state) return;
        switch (eventType) {
            case AgentEventTypeEnum.STEP_START: {
                const newStepContainer = {
                    status: StepsStatusEnum.RUNNING,
                    stepMessages: [message]
                };
                state.updateStepsContainer(prev => [...prev, newStepContainer]);
                break ;
            }
            case AgentEventTypeEnum.TOOL_CALL: {
                state.addStepMessageInLastStepContainer(message);
                break ;
            }
            case AgentEventTypeEnum.TOOL_RESULT: {
                state.addStepMessageInLastStepContainer(message);
                break ;
            }
            case AgentEventTypeEnum.STEP_PROGRESS: {
                const agentEventResponseCoreContent = JSON.parse(message.content) as AgentEventResponseCoreContent;
                if (state.isContainStepProgress(agentEventResponseCoreContent.stepProgressId))// 已经有了STEP_PROGRESS
                    state.updateStepProgressStepMessage(message);
                else
                    state.addStepMessageInLastStepContainer(message);
                break;
            }
            case AgentEventTypeEnum.STEP_PROGRESS_DONE: {
                state.updateStepProgressStepMessage(message);
                break ;
            }
            case AgentEventTypeEnum.STEP_PROGRESS_ERROR: {
                state.addStepMessageInLastStepContainer(message);
                break ;
            }
            case AgentEventTypeEnum.STEP_RESTART: {
                state.updateStatusInLastStepContainer(StepsStatusEnum.ERROR);
                const newStepContainer = {
                    status: StepsStatusEnum.RESTARTED,
                    stepMessages: [message]
                };
                state.updateStepsContainer(prev => [...prev, newStepContainer]);
                break ;
            }
            case AgentEventTypeEnum.STEP_DONE: {
                state.updateLastStepContainer(StepsStatusEnum.DONE, message);
                break ;
            }
        }
    },
    clearStepsContainer: () => setState(({
        stepsContainer: [],
    }))
}));
