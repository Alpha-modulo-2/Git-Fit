import { Document, Types } from "mongoose";
import IUser from "../interfaces/IUser";

export default function userFormater(user: Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId;
}): IUser {

    const { _id, ...restOfUser } = user.toObject()

    const formatedUser = { ...restOfUser, id: _id.toString() }
    return formatedUser
}