import { Types } from 'mongoose';

export default interface IFriendsRequests {
    requester: typeof Types.ObjectId,
    recipient: typeof Types.ObjectId,
    status: string,
    created_at: Date
}