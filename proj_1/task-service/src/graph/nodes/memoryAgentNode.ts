
import { AIMessage } from "langchain";
import { memoAgent } from "../../memoryAgent";
import {
    StateGraph,
    StateSchema,
    MessagesValue,
    ReducedValue,
    GraphNode,
    Command,
    ConditionalEdgeRouter,
    START,
    END
} from "@langchain/langgraph"
import { LLM } from "@langchain/core/language_models/llms";

export const memoryAgentNode: GraphNode<typeof MessagesState> = async (state, config: any) => {
    const { userId } = state

    const last = state.messages
        .filter((m: any) => m._getType() === "human")
        .slice(-1)[0];

    const llm = LLM.getInstance('fireworks_minmax')

    const { streamAgent } = await memoAgent({ model: llm, userId })

    const { fullContent } = await streamAgent(last?.content, config)

    return new Command({
        update: { mesages: [new AIMessage(fullContent)], nextNode: END },
        goto: END,
    })
}