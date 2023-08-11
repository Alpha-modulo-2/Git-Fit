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
    created_at: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
    id: SchemaTypes.ObjectId,
})

const messageModel = model("Message", messageSchema)

export { messageModel } 