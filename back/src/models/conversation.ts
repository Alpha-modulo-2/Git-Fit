// import { Schema } from "mongoose"
import { string } from "yup";
import IConversation from "../interfaces/IConversation";
import { Schema, SchemaTypes, model } from "mongoose";

const conversationSchema = new Schema<IConversation>({
    members: [{
        type: SchemaTypes.ObjectId,
        ref: "User"
    }],
    created_at: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
    id: SchemaTypes.ObjectId,
})

const conversationModel = model("Conversation", conversationSchema)

export { conversationModel } 