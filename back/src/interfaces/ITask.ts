import { Types } from 'mongoose';

export default interface ITask {
    _id?: Types.ObjectId | string,
    description: String;
}