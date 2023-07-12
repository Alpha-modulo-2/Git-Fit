// import { Schema } from "mongoose"
import { ObjectId } from "mongodb";
// import IUser from "../interfaces/IUser";


// const userSchema = new Schema<IUser>({
//     userName: String,
//     password: String,
//     email: String,
//     created_at: Date,
//     friends: [ObjectId],
//     photo: String,
//     gender: String,
//     weight: String,
//     height: String,
//     occupation: String,
//     age: Number,
//     id: ObjectId,
// })
// Class Implementation
export default class User {
    constructor(
        public userName: string,
        public password: String,
        public email: String,
        public created_at: Date,
        public friends: User[],
        public photo: String,
        public gender: String,
        public weight: String,
        public height: String,
        public occupation: String,
        public age: Number,
        public id?: ObjectId,
    ) { }
}

// export default userSchema 