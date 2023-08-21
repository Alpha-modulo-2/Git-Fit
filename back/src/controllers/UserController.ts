import { Request, Response } from "express";
import UserService from "../services/UserServices";
import jwt from "jsonwebtoken"
import IToken from "../interfaces/IToken";
import IUser from "../interfaces/IUser";

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
            const { userName, password, email, friends, gender, weight, height, occupation, age, name, } = req.body

            const user = {
                userName,
                password,
                email,
                friends,
                photo: req.file?.filename || "",
                gender,
                weight,
                height,
                occupation,
                age,
                name
            }

            const result = await this.service.insert(user);

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
        try {
            const { id } = req.params;
            const { userName, password, email, friends, gender, weight, height, occupation, age, name } = req.body;
    
            let user: IUser = 
                req.body
            ;

            if (req.file?.filename) {
                user = {...req.body, photo: req.file.filename}
            }

            const result = await this.service.update(id, user);

            return res.status(result.statusCode).json(result.statusCode >= 300 ? result.message : result);
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
            const cookieId = (data as IToken).user._id

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

            if (typeof data === "string") {
                throw new Error("JWT data is a string, expected an object.");
            }

            const cookieId = data.user._id

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