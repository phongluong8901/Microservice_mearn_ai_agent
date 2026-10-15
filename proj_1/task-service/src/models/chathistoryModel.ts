import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHitlAction {
    id?: string;
    interruptId?: string;
    tool_name?: string;
    tool_description?: string;
    args?: any;
}

export interface IHitl {
    status: boolean;
    actions?: IHitlAction[];
}

export interface IMessage {
    id: string;
    role: "user" | "ai";
    userId: string;
    content: string;
    thinking?: string;
    hitl?: IHitl;
}

export interface IChatHistory extends Document {
    userId: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const HitlActionSchema = new Schema<IHitlAction>({
    id: {
        type: String,
    },
    interruptId: {
        type: String,
    },
    tool_name: {
        type: String,
    },
    tool_description: {
        type: String,
    },
    args: {
        type: Object,
    },
},
    { _id: false }
);

const HitlSchema = new Schema<IHitl>({
    status: {
        type: Boolean,
        required: true,
    },
    actions: {
        type: [HitlActionSchema],
        default: []
    }
},
    { _id: false }
);

const MessageSchema = new Schema<IMessage>({
    id: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    },
    userId: {
        type: String,
        index: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    thinking: {
        type: String,
    },
    hitl: {
        type: HitlSchema,
    }
},
    { _id: false }
);

const ChatHistorySchema = new Schema<IChatHistory>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
},
    { timestamps: true }
);

export const ChatHistoryModel: Model<IChatHistory> = mongoose.model<IChatHistory>(
    "ChatHistory",
    ChatHistorySchema
);