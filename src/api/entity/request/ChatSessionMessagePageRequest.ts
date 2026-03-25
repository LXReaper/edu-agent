import type {PageRequest} from "./PageRequest.ts";

export type ChatSessionMessagePageRequest = PageRequest & {
    chatSessionId: string;
}
