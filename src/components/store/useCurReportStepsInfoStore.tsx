import {create} from 'zustand';
import type {StepContainer} from "../../type";
import {StepsStatusEnum} from "../../type";
import type {ChatSessionMessage} from "../../api/entity/models/ChatSessionMessage.ts";
import {AgentEventTypeEnum} from "../../api/entity/enums/AgentEventTypeEnum.ts";
import type {AgentEventResponseCoreContent} from "../../api/entity/AgentEventResponseCoreContent.ts";


type AgentStepsContainer = {
    agentId: string;
    stepsContainer: StepContainer[];
}

// 当前打开的report面板内显示的数据
// https://zustand.docs.pmnd.rs/guides/updating-state
type State = {
    agentsStepsContainer: AgentStepsContainer[];
};

type Action = {
    updateAddStepsContainer: (agentId: string, newStepContainer: StepContainer) => void;
    getAgentsStepsContainerLength: () => number;
    getAgentSteps: (index: number) => StepContainer;
    addStepMessageInStepContainerByAgentId: (agentId: string, newMessage: ChatSessionMessage) => void;

    updateInLastStepContainerByAgentId: (agentId: string, status: StepsStatusEnum, newMessage: ChatSessionMessage) => void;

    // 最新的StepContainer
    updateStepProgressStepMessageOnStepContainerByAgentId: (agentId: string, newMessage: ChatSessionMessage) => boolean;

    stepsContainerUpdate: (eventType: AgentEventTypeEnum, message: ChatSessionMessage) => void;
    clearStepsContainer: () => void;
}

export const useCurReportStepsInfoStore = create<State & Action>((setState, getState) => ({
    agentsStepsContainer: [],
    updateAddStepsContainer: (agentId: string, newStepContainer: StepContainer) => {
        let isContainThisAgentStepsContainer = false;
        setState(state => ({
            ...state,
            agentsStepsContainer: state.agentsStepsContainer.map((agentStepsContainer: AgentStepsContainer) => {
                if (agentStepsContainer.agentId !== agentId) return agentStepsContainer;

                agentStepsContainer.stepsContainer.push(newStepContainer);
                isContainThisAgentStepsContainer = true;
                return agentStepsContainer;
            })
        }))

        if (!isContainThisAgentStepsContainer)
            setState(state => ({
                ...state,
                agentsStepsContainer: [...state.agentsStepsContainer, {
                    agentId: agentId,
                    stepsContainer: [newStepContainer],
                } as AgentStepsContainer]
            }));
    },
    getAgentsStepsContainerLength: () => {
        const state = getState();
        if (!state) return 0;
        return state.agentsStepsContainer.length;
    },
    getAgentSteps: (index: number) => {
        const state = getState();
        if (!state) return null;
        return state.agentsStepsContainer[index].stepsContainer;
    },
    addStepMessageInStepContainerByAgentId: (agentId: string, newMessage: ChatSessionMessage) => {
        setState(state => ({
            ...state,
            agentsStepsContainer: state.agentsStepsContainer.map((agentStepsContainer) => {
                if (agentStepsContainer.agentId !== agentId) return agentStepsContainer;
                const stepsContainer = agentStepsContainer.stepsContainer;
                if (!stepsContainer || stepsContainer.length == 0) return agentStepsContainer;
                return {
                    ...agentStepsContainer,
                    stepsContainer: stepsContainer.map((step, i) =>
                        i === stepsContainer.length - 1 ?
                            {
                                ...step,
                                stepMessages: newMessage ? [...step?.stepMessages ?? [], newMessage] : step.stepMessages
                            } : step
                    ),
                }
            })
        }));
    },

    updateInLastStepContainerByAgentId: (agentId: string, status: StepsStatusEnum, newMessage: ChatSessionMessage) => {
        setState(state => ({
            ...state,
            agentsStepsContainer: state.agentsStepsContainer.map((agentStepsContainer) => {
                if (agentStepsContainer.agentId !== agentId) return agentStepsContainer;
                const stepsContainer = agentStepsContainer.stepsContainer;
                if (!stepsContainer || stepsContainer.length == 0) return agentStepsContainer;
                return {
                    ...agentStepsContainer,
                    stepsContainer: stepsContainer.map((step, i) =>
                        i === stepsContainer.length - 1 ?
                            {
                                ...step,
                                status: status,
                                stepMessages: newMessage ? [...step?.stepMessages ?? [], newMessage] : step.stepMessages
                            } : step
                    ),
                }
            })
        }));
    },

    updateStepProgressStepMessageOnStepContainerByAgentId: (agentId: string, newMessage: ChatSessionMessage) => {
        const agentEventResponseCoreContent = JSON.parse(newMessage.content) as AgentEventResponseCoreContent;
        let isUpdate = false;
        setState(state => ({
            ...state,
            agentsStepsContainer: state.agentsStepsContainer.map((agentStepsContainer) => {
                if (agentStepsContainer.agentId !== agentId) return agentStepsContainer;
                const stepsContainer = agentStepsContainer.stepsContainer;
                if (!stepsContainer || stepsContainer.length == 0) return agentStepsContainer;
                return {
                    ...agentStepsContainer,
                    stepsContainer: stepsContainer.map((step) => {
                        if (step.status !== StepsStatusEnum.RUNNING) return step;
                        return step.stepMessages.map((stepMessage: ChatSessionMessage) => {
                            if (stepMessage.eventType === AgentEventTypeEnum.STEP_PROGRESS) {
                                const coreContent = JSON.parse(stepMessage.content) as AgentEventResponseCoreContent;
                                if (agentEventResponseCoreContent.stepProgressId === coreContent.stepProgressId) {
                                    isUpdate = true;
                                    return newMessage;
                                }
                            }
                            return stepMessage;
                        })
                    }),
                }
            }),
        }));
        return isUpdate;
    },

    stepsContainerUpdate: (eventType: AgentEventTypeEnum, message: ChatSessionMessage) => {
        const state = getState();
        if (!state) return;
        const agentId = message.agentId;
        switch (eventType) {
            case AgentEventTypeEnum.STEP_START: {
                const newStepContainer = {
                    status: StepsStatusEnum.RUNNING,
                    stepMessages: [message]
                };
                state.updateAddStepsContainer(agentId, newStepContainer);
                break ;
            }
            case AgentEventTypeEnum.TOOL_CALL: {
                state.addStepMessageInStepContainerByAgentId(agentId, message);
                break ;
            }
            case AgentEventTypeEnum.TOOL_RESULT: {
                state.addStepMessageInStepContainerByAgentId(agentId, message);
                break ;
            }
            case AgentEventTypeEnum.STEP_PROGRESS: {
                // 如果已经有了STEP_PROGRESS，就直接更新，没有就触发addStepMessageInStepContainerByAgentId
                if (!state.updateStepProgressStepMessageOnStepContainerByAgentId(agentId, message)) {
                    state.addStepMessageInStepContainerByAgentId(agentId, message);
                }
                break;
            }
            case AgentEventTypeEnum.STEP_PROGRESS_DONE: {
                state.updateStepProgressStepMessageOnStepContainerByAgentId(agentId, message);
                break ;
            }
            case AgentEventTypeEnum.STEP_PROGRESS_ERROR: {
                state.addStepMessageInStepContainerByAgentId(agentId, message);
                break ;
            }
            case AgentEventTypeEnum.STEP_RESTART: {
                state.updateInLastStepContainerByAgentId(agentId, StepsStatusEnum.ERROR, null);
                const newStepContainer = {
                    status: StepsStatusEnum.RESTARTED,
                    stepMessages: [message]
                };
                state.updateAddStepsContainer(agentId, newStepContainer);
                break ;
            }
            case AgentEventTypeEnum.STEP_DONE: {
                state.updateInLastStepContainerByAgentId(agentId, StepsStatusEnum.DONE, message);
                break ;
            }
        }
    },
    clearStepsContainer: () => setState(({
        agentsStepsContainer: [],
    }))
}));
