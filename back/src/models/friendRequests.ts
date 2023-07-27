import { Schema, model, Types } from 'mongoose';
import IFriendRequests from '../interfaces/IFriendRequests';

const FriendRequestsSchema = new Schema<IFriendRequests>({
    requester: { 
        type: Types.ObjectId,
        ref: 'User',
        required: true 
    },
    recipient: {
        type: Types.ObjectId,
        ref: 'User',
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: true,
        default: 'pending'
    },
    created_at: {
        type: Date,
        required: true,
        default: () => new Date()
    },
});

const friendRequestsModel = model("FriendRequest", FriendRequestsSchema)

export { friendRequestsModel }