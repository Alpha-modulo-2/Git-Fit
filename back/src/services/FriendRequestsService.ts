import IResult from "../interfaces/IResult";
import FriendRequestsRepository from "../repositories/FriendRequestsRepository";

export default class FriendRequestsService {
    private repository: FriendRequestsRepository;

    constructor(repository: FriendRequestsRepository = new FriendRequestsRepository()) {
        this.repository = repository;
    }

    async insert(requesterId: string, recipientId: string): Promise<IResult> {
        try {
            const result = await this.repository.insert(requesterId, recipientId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async friendRequestsByUser(userId: string): Promise<IResult> {
        try {
            const result = await this.repository.friendRequestsByUser(userId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }

    async acceptFriend(requestId: string): Promise<IResult> {
        try {
            const result = await this.repository.acceptFriend(requestId);
            return result;
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }
    
    async rejectFriend(requestId: string): Promise<IResult> {
        try {
            const result = await this.repository.rejectFriend(requestId);
            return result
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            };
        }
    }
}