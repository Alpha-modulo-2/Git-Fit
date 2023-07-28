import IResult from "../interfaces/IResult";
import { friendRequestsModel } from "../models/friendRequests";
import { userModel } from "../models/user";

export default class FriendRequestsRepository {
    async insert(requesterId: string, recipientId: string): Promise<IResult> {

        try {
            const existingRequest = await friendRequestsModel.findOne({
                requester: requesterId,
                recipient: recipientId
            });

            if (existingRequest) {
                throw new Error("A solicitação de amizade já existe.");
            }

            const requester = await userModel.findById(requesterId);
            const recipient = await userModel.findById(recipientId);
    
            if (!requester || !recipient) {
                throw new Error("Usuário não encontrado.");
            }
    
            if (requester.friends.includes(recipient._id.toString()) || recipient.friends.includes(requester._id.toString())) {
                throw new Error("Estes usuários já são amigos.");
            }

            const result = await friendRequestsModel.create({ 
                requester: requesterId, 
                recipient: recipientId
            })

            return {
                error: false,
                statusCode: 201,
                friendRequests: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async friendRequestsByUser(userId: string): Promise<IResult> {
        try {
            const result = await friendRequestsModel.find({
                recipient: userId
            });
    
            return {
                error: false,
                statusCode: 200,
                friendRequests: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async acceptFriend(requestId: string): Promise<IResult> {
        try {
            const friendRequest = await friendRequestsModel.findById(requestId);
    
            if (!friendRequest) {
                throw new Error("Solicitação de amizade não encontrada.");
            }
    
            const requester = await userModel.findById(friendRequest.requester);
            const recipient = await userModel.findById(friendRequest.recipient);

            if (!requester || !recipient) {
                throw new Error("Usuário não encontrado.");
            }
    
            if (requester.friends.includes(recipient._id.toString())) {
                throw new Error("Este usuário já é seu amigo.");
            }
    
            await userModel.findByIdAndUpdate(friendRequest.requester, { $addToSet: { friends: friendRequest.recipient } });
            await userModel.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.requester } });
    
            await friendRequestsModel.findByIdAndDelete(requestId);
    
            return {
                error: false,
                statusCode: 200,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    async rejectFriend(requestId: string): Promise<IResult> {
        try {
            const friendRequest = await friendRequestsModel.findById(requestId);
    
            if (!friendRequest) {
                throw new Error("Solicitação de amizade não encontrada.");
            }
    
            await friendRequestsModel.findByIdAndDelete(requestId);
    
            return {
                error: false,
                statusCode: 200,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }
}