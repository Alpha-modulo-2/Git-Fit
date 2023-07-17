import { Types } from 'mongoose';

export default interface IMeal {
    _id?: Types.ObjectId;
    description: String;
}