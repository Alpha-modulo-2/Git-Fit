import { Request, Response } from "express";
import MessageService from "../services/messageService";

export default class MessageController {
    private service: MessageService;

    constructor(service?: MessageService) {
        this.service = service || new MessageService();
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
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

}