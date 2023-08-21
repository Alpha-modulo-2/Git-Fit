// import { Schema } from "mongoose"
import IMessage from "../interfaces/IMessage";
import { Schema, SchemaTypes, model } from "mongoose";

const messageSchema = new Schema<IMessage>({
    chatId: {
        type: SchemaTypes.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    },
    text: String,
    isRead: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
})

const messageModel = model("Message", messageSchema)

export { messageModel } 