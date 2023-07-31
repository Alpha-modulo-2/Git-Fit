import { Request, Response } from "express";
import FriendRequestsService from "../services/FriendRequestsService";

export default class FriendRequestsController {
    private service: FriendRequestsService;

    constructor(service?: FriendRequestsService) {
        this.service = service || new FriendRequestsService();
        this.insert = this.insert.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
        this.friendRequestsByUser = this.friendRequestsByUser.bind(this);
        this.rejectFriend = this.rejectFriend.bind(this);
    }

    async insert(req: Request, res: Response) {
        const { requesterId, recipientId } = req.body

        try {
            const result = await this.service.insert(requesterId, recipientId);
            
            if (!result.error) {
                return res.status(result.statusCode).json(result);
            }

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Error creating friend request", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async friendRequestsByUser(req: Request, res: Response) {
        const { userId } = req.params;
    
        try {
            const result = await this.service.friendRequestsByUser(userId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao obter solicitações de amizade do usuário", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async acceptFriend(req: Request, res: Response) {
        const { requestId } = req.body;
    
        try {
            const result = await this.service.acceptFriend(requestId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao aceitar solicitação de amizade", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async rejectFriend(req: Request, res: Response) {
        const { requestId } = req.params;
    
        try {
            const result = await this.service.rejectFriend(requestId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao rejeitar solicitação de amizade", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }
}