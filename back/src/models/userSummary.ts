import { Schema, model } from "mongoose";

const UserSummarySchema = new Schema({
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
        // You can expand this with other card categories if needed
    }
});

const UserSummaryModel = model("UserSummary", UserSummarySchema);

export { UserSummaryModel };