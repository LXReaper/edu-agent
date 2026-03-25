export enum AgentEventTypeEnum {
    THINKING = "THINKING",// 思考
    THINKING_DONE = "THINKING_DONE",// 思考结束
    SKILLS_NEEDED = "SKILLS_NEEDED",// 技能需要
    TASK_REASONING = "TASK_REASONING",// 任务创建的理由
    TOOL_CALL = "TOOL_CALL",// 工具调用
    TOOL_RESULT = "TOOL_RESULT",// 工具调用结果
    TODO_STEP_GET = "TODO_STEP_GET",// 获取到todo steps信息
    STEP_START = "STEP_START",// 开始步骤
    STEP_RESTART = "STEP_RESTART",// 重新开始步骤
    STEP_PROGRESS = "STEP_PROGRESS",// 步骤执行输出中
    STEP_PROGRESS_DONE = "STEP_PROGRESS_DONE",// 步骤执行输出结束
    STEP_PROGRESS_ERROR = "STEP_PROGRESS_ERROR",// 步骤执行输出过程中错误
    STEP_DONE = "STEP_DONE",// 完成步骤
    SUCCESS = "SUCCESS",// 完成所有任务
    ERROR = "ERROR",// 错误
}
