import ICard from "./ICard";
import IUser from "./IUser";
import IFriendsRequests from "./IFriendRequests";
import IConversation from "./IConversation";
import IMessage from "./IMessage";

export default interface IResult {
    error: boolean,
    message?: string,
    statusCode: number,
    user?: IUser | IUser[],
    card?: ICard | ICard[],
    data?: string,
    friendRequests?: IFriendsRequests | IFriendsRequests[],
    conversation?: IConversation | IConversation[],
    chatMessage?: IMessage | IMessage[]
}