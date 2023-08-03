import IResult from "../interfaces/IResult";
import IUpdateUserData from "../interfaces/IUpdateUserData";
import IUser from "../interfaces/IUser";
import { userModel } from "../models/user";

export default class UserRepository {
    async insert(user: IUser): Promise<IResult> {
        try {

            const result = await userModel.create(user)

            if (!result) {
                const error = {
                    message: "Usuário não encontrado.",
                    code: 404
                }
                throw error
            }

            return {
                error: false,
                statusCode: 201,
                user: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async get(): Promise<IResult> {
        try {

            const users = await userModel.find().select("-password").populate("friends", { userName: 1, name: 1, photo: 1, occupation: 1, id: 1 });

            if (!users) {
                throw new Error("Erro no servidor")
            }

            return {
                error: false,
                statusCode: 200,
                user: users,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async getOne(id: string): Promise<IResult> {

        try {

            const user = await userModel.findById(id).select("-password").populate("friends", { userName: 1, name: 1, photo: 1, occupation: 1, id: 1 });

            if (!user) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Usuário não encontrado"
                }
                throw error
            }

            return {
                error: false,
                statusCode: 200,
                user: user,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async update(id: string, updateData: IUpdateUserData): Promise<IResult> {

        try {

            const user = await userModel.findByIdAndUpdate(id, { $set: updateData, updated_at: new Date }).select("-password")

            if (!user) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Usuário não encontrado"
                }

                throw error
            }

            return {
                error: false,
                statusCode: 200,
                user: user
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async delete(id: string): Promise<IResult> {

        try {

            const user = await userModel.findById(id)

            if (!user) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Usuário não encontrado."
                }
                throw error
            }

            user.deleteOne()

            return {
                error: false,
                statusCode: 204,
            }


        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async getByName(name: string): Promise<IResult> {

        try {
            const user = await userModel.find({ userName: { $regex: '.*' + name + '.*', $options: 'i' } }).select("-password").populate("friends", { userName: 1, name: 1, photo: 1, occupation: 1, id: 1 });

            if (!user) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Usuário não encontrado."
                }
                throw error
            }

            return {
                error: false,
                statusCode: 200,
                user: user,
            }


        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async removeFriend(friendId: string, userId: string): Promise<IResult> {
        try {
            const user = await userModel.findById(userId);
            const friend = await userModel.findById(friendId);

            if (!user || !friend) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Usuário não encontrado."
                }
                throw error
            }

            if (!user.friends.includes(friend._id.toString())) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Este usuário não é seu amigo."
                }
                throw error
            }

            await userModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
            await userModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

            return {
                error: false,
                statusCode: 204,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            };
        }
    }

}