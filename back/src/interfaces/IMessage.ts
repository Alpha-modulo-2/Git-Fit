import { Types } from 'mongoose';

export default interface IMessage {
    chatId: Types.ObjectId,
    sender: Types.ObjectId,
    text: string,
    id?: string,
    created_at?: Date,
}