import { Types } from 'mongoose';
import ITask from './ITask';
import IMeal from './IMeal';

export default interface ICard {
    _id?: Types.ObjectId | string,
    userId: Types.ObjectId | string,
    name: string,
    created_at: Date,
    updated_at: Date,
    trainingCard: {
        checked: boolean,
        title: String,
        tasks: ITask[]
    },
    mealsCard: {
        checked: boolean,
        meals: IMeal[]
    },
}