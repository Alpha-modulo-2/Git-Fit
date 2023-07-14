import { Request, Response } from "express";
import UserService from "../services/UserServices";

export default class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
        this.insert = this.insert.bind(this);
        this.get = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async insert(req: Request, res: Response) {
        try {
            const result = await this.service.insert(req.body);
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao inserir a conta", error.message);
            return res.status(500);
        }
    }

    async getOne(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.getOne(id);
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta", error.message);
            return res.status(500);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const result = await this.service.get();
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro no login", error.message);
            return res.status(500);
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.update(id, req.body);
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta 1", error);
            return res.status(500);
        }
    }


    async delete(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.delete(id);
            return res.status(result.statusCode || 500).json("" || result.message);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta 1", error);
            return res.status(500);
        }
    }
}