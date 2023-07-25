// import { Schema } from "mongoose"
import IUser from "../interfaces/IUser";
import { Schema, SchemaTypes, model } from "mongoose";

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    created_at: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
    updated_at: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    friends: [
        {
            type: SchemaTypes.ObjectId,
            ref: "User"
        }
    ],
    photo: String,
    gender: String,
    weight: String,
    height: String,
    occupation: {
        type: String,
        required: true
    },
    age: Number,
    id: SchemaTypes.ObjectId,
})

const userModel = model("User", userSchema)

export { userModel } 