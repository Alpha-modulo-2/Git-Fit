import ICard from "./ICard";
import IUser from "./IUser";
import IFriendsRequests from "./IFriendRequests";

export default interface IResult {
    error: boolean,
    message?: string,
    statusCode: number,
    user?: IUser | IUser[],
    card?: ICard | ICard[],
    data?: string