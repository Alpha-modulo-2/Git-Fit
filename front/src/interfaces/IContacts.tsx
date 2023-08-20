import { User } from "./IUser";

export interface FriendRequest {
    _id: string;
    requester?: User;
    recipient: string;
    created_at: string;
    __v: number;
}

export interface ApiResponseRequests {
    error: boolean;
    statusCode: number;
    message?: string;
    friendRequests: FriendRequest[];
}