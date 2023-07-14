import { ObjectId } from "mongodb";

export default interface IUser {
    userName: String,
    password: String,
    email: String,
    created_at: Date,
    friends: [ObjectId],
    photo: String,
    gender: String,
    weight: String,
    height: String,
    occupation: String,
    age: Number,
    id?: ObjectId,
}