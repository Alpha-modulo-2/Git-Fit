import { Request, Response } from "express";
import UserSummaryService from "../services/userSummaryService";

export default class UserSummaryController {
    private service: UserSummaryService;

    constructor(service?: UserSummaryService) {
        this.service = service || new UserSummaryService();
        this.getOne = this.getOne.bind(this);
    }

    async getOne(req: Request, res: Response) {
        const { userId } = req.params

        try {
            const result = await this.service.getOne(userId);
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao buscar user Summary: ${error.message}`
            });
        }
    }
}