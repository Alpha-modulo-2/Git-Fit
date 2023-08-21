import { Request, Response } from "express";
import MessageService from "../services/messageService";

export default class MessageController {
    private service: MessageService;

    constructor(service?: MessageService) {
        this.service = service || new MessageService();
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
    }

    async create(req: Request, res: Response) {
        try {

            const { chatId, sender, text } = req.body

            const result = await this.service.create({ chatId, sender, text });

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.chatMessage);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao criar a mensagem ${error.message}`
            });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { chatId } = req.params

            const result = await this.service.get(chatId);
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.chatMessage);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao buscar as mensagens: ${error.message}`
            });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const { messageIds } = req.body;

            if (!messageIds || !Array.isArray(messageIds)) {
                return res.status(400).json({
                    error: true,
                    statusCode: 400,
                    message: 'Invalid input',
                });
            }

            const result = await this.service.markAsRead(messageIds);

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Error marking messages as read: ${error.message}`
            });
        }
    }

}