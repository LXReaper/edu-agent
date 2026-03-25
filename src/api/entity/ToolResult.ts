import type {ToolNameTypeEnum} from "./enums/ToolNameTypeEnum.ts";

export type ToolResult = {
    succeed: boolean;
    errorType: string;
    message: string;
    requiredParams: string[];
    tool: ToolNameTypeEnum;
    data: string;
}
