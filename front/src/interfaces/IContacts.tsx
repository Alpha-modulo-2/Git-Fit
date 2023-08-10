import { User } from "./IUser";

export interface FriendRequest {
    _id: string;
    requester: string;
    recipient: string;
    status: string;
    created_at: string;
    __v: number;
    requesterInfo?: User
}
  
export interface ApiResponseRequests {
    error: boolean;
    statusCode: number;
    message?: string;
    friendRequests: FriendRequest[];
}