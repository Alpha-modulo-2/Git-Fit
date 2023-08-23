import { Types } from "mongoose";

export default interface IUserSummary {
    user: Types.ObjectId | string;
    weight: string;
    date?: Date;
    checks: {
        trainingCard: number;
        mealsCard: number;
    };
    _id?: Types.ObjectId | string;
}