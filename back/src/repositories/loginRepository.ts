import ILogin from "../interfaces/ILogin";
import IResult from "../interfaces/IResult";
import IUser from "../interfaces/IUser";
import { userModel } from "../models/user";

export default class LoginRepository {
    async login(data: ILogin): Promise<IResult> {

        try {

            const user = await userModel.findOne({ userName: data.userName });

            if (user) {
                const userData: IUser = {
                    id: user._id.toString(),
                    userName: user.userName,
                    password: user.password as string,
                    email: user.email,
                    friends: user.friends,
                    photo: user.photo,
                    gender: user.gender,
                    weight: user.weight,
                    height: user.height,
                    occupation: user.occupation,
                    age: user.age,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                }

                return {
                    error: false,
                    statusCode: 200,
                    user: userData,
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
