import IResult from "../interfaces/IResult";
import { friendRequestsModel } from "../models/friendRequests";
import { userModel } from "../models/user";
import CustomError from "../helpers/CustomError";

export default class FriendRequestsRepository {
    async insert(requesterId: string, recipientId: string): Promise<IResult> {

        try {
            const existingRequest = await friendRequestsModel.findOne({
                requester: requesterId,
                recipient: recipientId
            });

            if (existingRequest) {
                throw new CustomError("A solicitação de amizade já existe.", 409);
            }

            const requester = await userModel.findById(requesterId);
            const recipient = await userModel.findById(recipientId);
    
            if (!requester || !recipient) {
                throw new CustomError("Usuário não encontrado.", 404);
            }
    
            if (requester.friends.includes(recipient._id.toString()) || recipient.friends.includes(requester._id.toString())) {
                throw new CustomError("Estes usuários já são amigos.", 404);
            }

            const result = await friendRequestsModel.create({ 
                requester: requesterId, 
                recipient: recipientId
            })

            return {
                error: false,
                statusCode: 201,
                message: `Solicitação de amizade enviada com sucesso.`,
                friendRequests: result,
            }
        } catch (error: any) {
            console.log(error instanceof CustomError, error);
            if (error instanceof CustomError) {
                console.log('entrou')
                console.log(error.statusCode)
                return {
                    error: true,
                    message: error.message,
                    statusCode: error.statusCode,
                }
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async friendRequestsByUser(userId: string): Promise<IResult> {
        try {
            const result = await friendRequestsModel.find({
                recipient: userId
            }).populate('requester', '-password -email -created_at -updated_at');
    
            if (!result || result.length === 0) {
                throw new CustomError("Nenhuma solicitação de amizade encontrada.", 404);
            }
        
            return {
                error: false,
                statusCode: 200,
                friendRequests: result,
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    message: error.message,
                    statusCode: error.statusCode,
                };
            }
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
                throw new CustomError("Usuário não encontrado.", 404);
            }
    
            if (requester.friends.includes(recipient._id.toString())) {
                throw new CustomError("Este usuário já é seu amigo.", 400);
            }
    
            await userModel.findByIdAndUpdate(friendRequest.requester, { $addToSet: { friends: friendRequest.recipient } });
            await userModel.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.requester } });
    
            await friendRequestsModel.findByIdAndDelete(requestId);
    
            return {
                error: false,
                statusCode: 200,
                message: "Solicitação de amizade aceita com sucesso."
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    message: error.message,
                    statusCode: error.statusCode,
                };
            }
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
                throw new CustomError("Solicitação de amizade não encontrada.", 404);
            }
    
            await friendRequestsModel.findByIdAndDelete(requestId);
    
            return {
                error: false,
                statusCode: 200,
                message: "Solicitação de amizade rejeitada e excluída com sucesso."
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    message: error.message,
                    statusCode: error.statusCode,
                };
            }
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }
}