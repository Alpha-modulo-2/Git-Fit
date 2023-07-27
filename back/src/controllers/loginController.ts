import { Request, Response } from "express";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import ILogin from "../interfaces/ILogin";
import loginService from "../services/loginService";

export default class LoginController {
    private service: loginService;

    constructor(service?: loginService) {  // Allow service to be injected
        this.service = service || new loginService();
        this.login = this.login.bind(this);
    }

    async login(req: Request, res: Response) {
        try {
            const credentials: ILogin = {
                userName: req.body.username,
                password: req.body.password,
            };

            const result = await this.service.login(credentials);


            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            const jwt = jwtLib.sign(
                { user: result.user },
                process.env.JWTSECRET
            );
            res.cookie("session", jwt);

            return res.status(result.statusCode || 500).json(
                {
                    message:
                        `Usuário '${credentials.userName}' logado com sucesso.`
                }
                || result.message
            );

        } catch (error: any) {
            return res.status(500).json({ message: error.message })
        }
    }

}