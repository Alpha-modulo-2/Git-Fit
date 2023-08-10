import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserService from "../services/UserServices";
import jwt from "jsonwebtoken"
import IToken from "../interfaces/IToken";

export default class UserController {
    private service: UserService;

    constructor(service?: UserService) {  // Allow service to be injected
        this.service = service || new UserService();
        this.insert = this.insert.bind(this);
        this.get = this.get.bind(this);
        this.getOne = this.getOne.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getByName = this.getByName.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
    }

    async insert(req: Request, res: Response) {
        try {

            const { password } = req.body

            const passwordHash = await bcrypt.hash(password, 10);

            const result = await this.service.insert({ ...req.body, password: passwordHash });

            if (result.error) {
                const message = result.message as string
                console.log('MESAGE', message)
                if (message.includes("E11000")) {
                    return res.status(500).json("Username já esta sendo utilizado");
                }
            }

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
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
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);

        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao buscar usuário: ${error.message}`
            });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const result = await this.service.get();
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao buscar usuários: ${error.message}`
            });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        try {

            let reqData = {
                ...req.body
            }

            if (req.body.password) {
                const { password } = req.body
                const passwordHash = await bcrypt.hash(password, 10);
                reqData = { ...req.body, password: passwordHash }
            }

            const result = await this.service.update(id, reqData);
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao atualizar a conta: ${error.message}`
            });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        try {

            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            const data = jwt.verify(req.cookies["session"], process.env.JWTSECRET);
            const cookieId = (data as IToken).user.id

            if (cookieId != id) {
                throw new Error("Você não pode remover uma conta de outra pessoa.")
            }

            const result = await this.service.delete(id);
            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : "Usuário deletado com sucesso!");
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao deletar a conta ${error.message}`
            });
        }
    }

    async getByName(req: Request, res: Response) {
        const name = req.query.name as string;

        try {
            const result = await this.service.getByName(name);

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao procurar usuários: ${error.message}`
            });
        }
    }

    async removeFriend(req: Request, res: Response) {
        const { userId, friendId } = req.params;

        try {
            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            const data = jwt.verify(req.cookies["session"], process.env.JWTSECRET);

            const cookieId = (data as IToken).user.id

            if (cookieId != userId) {
                throw new Error("Você não pode remover um amigo de outra pessoa.")
            }

            const result = await this.service.removeFriend(friendId, userId);

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result.user);
        } catch (error: any) {
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao remover amizade: ${error.message}`
            });
        }
    }
}