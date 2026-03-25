import React from "react";
import {PlanMessage} from "./planMessage.tsx";
import type {ChatSessionMessage} from "../../../../../api/entity/models/ChatSessionMessage.ts";
import {ResultMessage} from "./resultMessage.tsx";
import {StepsReportOpenMessage} from "./stepsReportOpenMessage.tsx";
import {PptxPreviewOpenMessage} from "./pptxPreviewOpenMessage.tsx";
import {DocxPreviewOpenMessage} from "./docxPreviewOpenMessage.tsx";
import {useCurChatSessionMessagesStore} from "../../../../store/useCurChatSessionMessagesStore.tsx";
import {AgentEventTypeEnum} from "../../../../../api/entity/enums/AgentEventTypeEnum.ts";
import type {ToolResult} from "../../../../../api/entity/ToolResult.ts";
import {ToolNameTypeEnum} from "../../../../../api/entity/enums/ToolNameTypeEnum.ts";
import type {SlideInfo} from "../../../../../api/entity/tools/SlideInfo.ts";

interface AssistantChatMessageProps {
    index: number;// 当前聊天会话中的第几组消息
    backGroundColor: string;

    setShowStepsReport: (isShow: boolean, index: number) => void;

    newAssistantMessage: ChatSessionMessage;// 新获取的消息
}
export const AssistantChatMessage: React.FC<AssistantChatMessageProps> = ({
    index,
    backGroundColor,

    setShowStepsReport,

    newAssistantMessage,
}) => {
    const {getAssistantMessagesInMessageContainer} = useCurChatSessionMessagesStore();

    return (
        <div className={`w-[100%] max-w-[100%] flex flex-col gap-[2vh] rounded-[15px]`}>
            {<PlanMessage index={index} backGroundColor={backGroundColor} newAssistantMessage={newAssistantMessage}/>}

            {<StepsReportOpenMessage index={index} backGroundColor={backGroundColor} setShowStepsReport={setShowStepsReport}/>}
            {
                getAssistantMessagesInMessageContainer(index).map((assistantMessage, id) => {
                    const sessionId = assistantMessage.sessionId;
                    switch (assistantMessage.eventType) {
                        case AgentEventTypeEnum.TOOL_RESULT: {
                            if (assistantMessage.eventType !== AgentEventTypeEnum.TOOL_RESULT) return <></>;
                            const toolResult = JSON.parse(assistantMessage.content) as ToolResult;
                            switch (toolResult.tool) {
                                case ToolNameTypeEnum.CREATE_RICH_PPT: {
                                    const slideInfo = JSON.parse(toolResult.data) as SlideInfo;
                                    return (
                                        <div key={id}>
                                            <PptxPreviewOpenMessage title={slideInfo.title} slideInfo={slideInfo} backGroundColor={backGroundColor}/>
                                        </div>
                                    );
                                }
                                case ToolNameTypeEnum.EXECUTE_JAVASCRIPT_DOCX: {
                                    const filePath = toolResult.data;
                                    if (!filePath) return <></>
                                    return (
                                        <div key={id}>
                                            <DocxPreviewOpenMessage chatSessionId={sessionId} filePath={filePath} backGroundColor={backGroundColor}/>
                                        </div>
                                    )
                                }

                            }
                            break;
                        }
                        case AgentEventTypeEnum.SUCCESS: {
                            if (assistantMessage.content)
                                return (
                                    <div key={id}>
                                        <ResultMessage backGroundColor={backGroundColor} content={assistantMessage.content}/>
                                    </div>
                                );
                            break;
                        }
                    }
                    return <></>;
                })
            }
        </div>
    )
}
