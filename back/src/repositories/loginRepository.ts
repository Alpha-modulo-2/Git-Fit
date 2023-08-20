import ILogin from "../interfaces/ILogin";
import IResult from "../interfaces/IResult";
import IUser from "../interfaces/IUser";
import { userModel } from "../models/user";

export default class LoginRepository {
    async login(data: ILogin): Promise<IResult> {

        try {
            const user = await userModel.findOne({ userName: data.userName }).populate("friends", { userName: 1, name: 1, photo: 1, occupation: 1, _id: 1 });

            if (user) {

                return {
                    error: false,
                    statusCode: 200,
                    user: user.toObject(),
                }
            }

            const error = {
                message: "Usuário ou senha incorretos.",
                code: 401
            }
            throw error


        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }

        }

    }

}