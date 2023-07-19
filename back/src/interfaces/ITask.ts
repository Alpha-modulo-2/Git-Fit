import { Types } from 'mongoose';

export default interface ITask {
    _id?: Types.ObjectId;
    description: String;
}