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
            let user: IUser

            if (result.error) {
                throw new Error(result.message)
            }

            if (!process.env.JWTSECRET) {
                throw new Error('JWTSECRET nao definido');
            }

            if (result.user) {

                if (Array.isArray(result.user)) {
                    user = result.user[0]
                } else {
                    user = result.user
                }

                if (user.password) {
                    const login = await bcrypt.compare(credentials.password, user.password);

                    const { password, ...restOfUser } = user

                    if (login) {

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
                    }
                }
            }
            throw new Error("")
        } catch (error: any) {
            return error.message;
        }
    }
}