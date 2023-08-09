import { Types } from 'mongoose';

export default interface IMeal {
    _id?: Types.ObjectId | string,
    description: String;
}