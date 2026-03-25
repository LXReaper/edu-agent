import type {ChatSessionConfig} from "./ChatSessionConfig.ts";

export type ChatSessionConfigPage = {
    records: ChatSessionConfig[];
    pageNumber: number;
    pageSize: number;
    maxPageSize: number;
    totalPage: number;
    totalRow: number;
    optimizeCountQuery: boolean;
}
