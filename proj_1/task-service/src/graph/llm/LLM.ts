import { ChatFireworks } from "@langchain/fireworks";

type LLMType = "fireworks_minimax" | "fireworks_glm";

export class LLM {
    private static instances: Partial<Record<LLMType, any>> = {};

    // Private constructor để chặn khởi tạo trực tiếp bên ngoài
    private constructor() { }

    /**
     * Lấy singleton instance của model
     */
    public static getInstance(type: LLMType = "fireworks_minimax"): any {
        if (!LLM.instances[type]) {
            const apiKey = process.env.FIREWORKS_API_KEY;
            if (!apiKey) {
                throw new Error("FIREWORKS_API_KEY is not set");
            }

            switch (type) {
                case "fireworks_minimax":
                    LLM.instances[type] = new ChatFireworks({
                        model: "accounts/fireworks/models/minimax-m3",
                        temperature: 0.7,
                        apiKey,
                    });
                    break;
                case "fireworks_glm":
                    LLM.instances[type] = new ChatFireworks({
                        model: "accounts/fireworks/models/glm-5p3",
                        temperature: 0.7,
                        apiKey,
                    });
                    break;
                default:
                    throw new Error(`Unsupported LLM type: ${type}`);
            }
        }

        return LLM.instances[type];
    }
}