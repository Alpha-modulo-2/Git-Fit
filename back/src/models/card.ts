import mongoose, { Schema, model } from 'mongoose';
import ICard from '../interfaces/ICard';

const TaskSchema: Schema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
});

const MealSchema: Schema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
});

const CardSchema = new Schema<ICard>({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
    updated_at: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    trainingCard: {
        checked: { type: Boolean, default: false },
        title: { type: String, required: true },
        tasks: [TaskSchema],
    },
    mealsCard: {
        checked: { type: Boolean, default: false },
        meals: [MealSchema],
    },
});


const cardModel = model("Card", CardSchema)

export { cardModel } 