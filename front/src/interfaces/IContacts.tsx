import { UserData } from "./IUser";

export interface FriendRequest {
    _id: string;
    requester?: UserData;
    recipient: string;
    created_at: string;
    __v: number;
}
// export interface FriendRequest {
//     _id: string;
//     requester: string;
//     recipient: string;
//     created_at: string;
//     __v: number;
//     requesterInfo?: UserData
// }
  
export interface ApiResponseRequests {
    error: boolean;
    statusCode: number;
    message?: string;
    friendRequests: FriendRequest[];
}