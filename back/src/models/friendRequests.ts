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
    created_at: {
        type: Date,
        required: true,
        default: () => new Date()
    },
});

const friendRequestsModel = model("FriendRequest", FriendRequestsSchema)

export { friendRequestsModel }