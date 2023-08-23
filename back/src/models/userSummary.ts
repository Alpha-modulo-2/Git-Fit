import { Schema, model } from "mongoose";
import IUserSummary from "../interfaces/IUserSummary";

const UserSummarySchema = new Schema<IUserSummary>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        immutable: true,
        required: true,
        default: () => new Date()
    },
    checks: {
        trainingCard: {
            type: Number,
            default: 0
        },
        mealsCard: {
            type: Number,
            default: 0
        }
    }
});

const userSummaryModel = model("UserSummary", UserSummarySchema);

export { userSummaryModel };