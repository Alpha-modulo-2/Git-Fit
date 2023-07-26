import UserValidator from "../validators/UserValidator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserService from "../services/UserServices";

export default class UserController {
    private service: UserService;

    constructor(service?: UserService) {  // Allow service to be injected
        this.service = service || new UserService();
        this.insert = this.insert.bind(this);
        this.get = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async insert(req: Request, res: Response) {
        try {
            const validationErrors = UserValidator(req.body);

            if (Object.keys(validationErrors).length > 0) {
                res.status(400).json({
                    error: true,
                    message: validationErrors,
                });
                return;
            }

            const { password } = req.body

            const passwordHash = await bcrypt.hash(password, 10);

            const result = await this.service.insert({ ...req.body, password: passwordHash });
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao inserir a conta", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao inserir a conta ${error.message}`
            });
        }
    }

    async getOne(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.getOne(id);
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao inserir a conta ${error.message}`
            });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const result = await this.service.get();
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro no login", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro no login ${error.message}`
            });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        const validationErrors = UserValidator(req.body);

        if (Object.keys(validationErrors).length > 0) {
            res.status(400).json({
                error: true,
                message: validationErrors,
            });
            return;
        }

        try {
            const result = await this.service.update(id, req.body);
            return res.status(result.statusCode || 500).json(result.user || result.message);
        } catch (error: any) {
            console.log("Erro ao atualizar a conta 1", error);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao atualizar a conta 1 ${error.message}`
            });
        }
    }


    async delete(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.delete(id);
            return res.status(result.statusCode || 500).json("" || result.message);
        } catch (error: any) {
            console.log("Erro ao deletar a conta", error);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao deletar a conta ${error.message}`
            });
        }
    }
}