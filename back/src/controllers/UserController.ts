import { Request, Response } from "express";
import UserService from "../services/UserServices";

export default class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
        this.insert = this.insert.bind(this);
        this.get = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
    }

    async insert(req: Request, res: Response) {
        try {
            const result = await this.service.insert(req.body);
            return res.status(500).json(result);
        } catch (error: any) {
            console.log("Erro ao inserir a conta", error.message);
            return res.status(500);
        }
    }

    async getOne(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.getOne(id);
            return res.status(500).json(result);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta", error.message);
            return res.status(500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const result = await this.service.get();
            return res.status(500).json(result);
        } catch (error: any) {
            console.log("Erro no login", error.message);
            return res.status(500);
        }
    }
}