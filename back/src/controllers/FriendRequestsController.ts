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

        if (!requesterId || requesterId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(requesterId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do solicitante inválido"
            });
        }

        if (!recipientId || recipientId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(requesterId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do solicitado inválido"
            });
        }

        try {
            const result = await this.service.insert(requesterId, recipientId);

            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao criar a solicitação de amizade ", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async friendRequestsByUser(req: Request, res: Response) {
        const { userId } = req.params;

        if (!userId || userId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(userId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID do user inválido"
            });
        }
    
        try {
            const result = await this.service.friendRequestsByUser(userId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao obter solicitações de amizade do usuário ", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async acceptFriend(req: Request, res: Response) {
        const { requestId } = req.body;

        if (!requestId || requestId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(requestId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        }
    
        try {
            const result = await this.service.acceptFriend(requestId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao aceitar solicitação de amizade ", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }

    async rejectFriend(req: Request, res: Response) {
        const { requestId } = req.params;
    
        if (!requestId || requestId.length !== 24 || !(/^[0-9a-fA-F]+$/).test(requestId)) {
            return res.status(400).json({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        }
        
        try {
            const result = await this.service.rejectFriend(requestId);
    
            return res.status(result.statusCode).json(result);
        } catch (error: any) {
            console.log("Erro ao rejeitar solicitação de amizade ", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }
}