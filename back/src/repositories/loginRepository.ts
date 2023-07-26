import ILogin from "../interfaces/ILogin";
import IResult from "../interfaces/IResult";
import IUser from "../interfaces/IUser";
import { userModel } from "../models/user";

export default class LoginRepository {
    async login(data: ILogin): Promise<IResult> {

        try {

            const user = await userModel.findOne({ userName: data.userName });

            if (user) {
                return {
                    error: false,
                    statusCode: 200,
                    user: user,
                }
            }

            throw new Error("Usuario nao encontrado")

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }

        }

    }

}
