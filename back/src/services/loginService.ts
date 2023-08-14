import ILogin from "../interfaces/ILogin";
import IResult from "../interfaces/IResult";
import IUser from "../interfaces/IUser";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import LoginRepository from "../repositories/loginRepository";

export default class LoginService {
    private repository: LoginRepository;

    constructor(repository: LoginRepository = new LoginRepository()) {
        this.repository = repository;
    }

    async login(credentials: ILogin): Promise<IResult> {

        try {
            const result = await this.repository.login(credentials);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            if (!result.user) {
                throw new Error('Nenhum usuario encontrado');
            }
            const login = await bcrypt.compare(credentials.password, (result.user as IUser).password!);

            if (login) {

                const { password, ...restOfUser } = result.user as IUser

                const sessionJWT = JWT.sign(
                    { restOfUser },
                    process.env.JWTSECRET,
                    { expiresIn: "336h" }
                );

                return {
                    ...result,
                    user: restOfUser,
                    data: sessionJWT
                }
            } else {
                const error = {
                    message: "Usuário ou senha incorretos.",
                    code: 401
                }
                throw error
            }


        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }
}