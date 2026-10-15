

import {
    END,
    START,
    StateGraph,
    Annotation,
    MessagesAnnotation,
    Command,
    MessagesValue, StateSchema
} from "@langchain/langgraph";
import { memoryAgentNode } from "./nodes/memoryAgentNode";
import { zstdCompress } from "node:zlib";
import { z } from "zod";


const MessagesState = new StateSchema({
    messages: MessagesValue,
    userId: z.string().default("")
});

const workflow = new StateGraph(MessagesState)
    .addNode("memoryAgent", memoryAgentNode)
    .addEdge(START, "memoryAgent")
    .addEdge("memoryAgent", END)

export const graph = workflow.compile();

