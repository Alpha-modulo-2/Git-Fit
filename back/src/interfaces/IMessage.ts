import { Types } from 'mongoose';

export default interface IMessage {
    chatId: Types.ObjectId,
    sender: Types.ObjectId,
    text: string,
    isRead?: boolean,
    _id?: string,
    created_at?: Date,
}