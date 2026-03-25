import {TodoStepTypeEnum} from "./enums/TodoStepTypeEnum.ts";

export type TodoStep = {
    step: number;
    step_name: string;
    type: TodoStepTypeEnum;
    result_content?: string;
    tool_name?: string;
    arguments?: string;
    forceRetry?: boolean;
}

export const isTodoStepType = (content: unknown): content is TodoStep => (
    typeof content === 'object' &&
    content !== null &&
    'step' in content &&
    'step_name' in content &&
    'type' in content &&
    Object.values(TodoStepTypeEnum).includes((content as Record<string, unknown>).type as TodoStepTypeEnum)
);
