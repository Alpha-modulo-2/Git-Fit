import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import ILogin from "../interfaces/ILogin";
import loginService from "../services/loginService";

export default class LoginController {
    private service: loginService;

    constructor(service?: loginService) {
        this.service = service || new loginService();
        this.login = this.login.bind(this);
    }

    async login(req: Request, res: Response) {
        try {
            if (!req.body.userName) {
                throw new Error('Usuário é obrigatório');
            }

            if (!req.body.password) {
                throw new Error('Senha é obrigatória');
            }

            const credentials: ILogin = {
                userName: req.body.userName,
                password: req.body.password,
            };

            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            const result = await this.service.login(credentials);

            const jwt = jwtLib.sign(
                { user: result.user },
                process.env.JWTSECRET
            );

            res.cookie("session", jwt);

            return res.status(result.statusCode).json(
                result.statusCode >= 300 ?
                    result.message :
                    {
                        message: `Usuário '${credentials.userName}' logado com sucesso.`,
                        user: result.user,
                        token: result.data
                    },

            );

        } catch (error: any) {
            return res.status(500).json({ message: error.message })
        }
    }

}