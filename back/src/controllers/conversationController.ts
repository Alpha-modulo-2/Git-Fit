import { Request, Response } from "express";
import ConversationService from "../services/conversationService";

export default class ConversationController {
    private service: ConversationService;

    constructor(service?: ConversationService) {
        this.service = service || new ConversationService();
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
    }

    async create(req: Request, res: Response) {
        try {

            const { userId, friendId } = req.body

            const result = await this.service.create({ members: [userId, friendId] });

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao criar a conversa ${error.message}`
            });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { userId } = req.params

            const result = await this.service.get(userId);
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.conversation);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao buscar a conversa: ${error.message}`
            });
        }
    }

}