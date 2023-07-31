import IResult from "../interfaces/IResult";
import IUpdateUserData from "../interfaces/IUpdateUserData";
import IUser from "../interfaces/IUser";
import { userModel } from "../models/user";

export default class UserRepository {
    async insert(user: IUser): Promise<IResult> {
        try {

            const result = await userModel.create(user)

            return {
                error: false,
                statusCode: 201,
                user: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async get(): Promise<IResult> {
        try {

            const users = await userModel.find().populate("friends");

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

            const user = await userModel.findById(id).populate("friends");

            if (user) {
                return {
                    error: false,
                    statusCode: 200,
                    user: user,
                }
            } else {
                return {
                    error: true,
                    statusCode: 500,
                    message: "Usuário não encontrado"
                }
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async update(id: string, updateData: IUpdateUserData): Promise<IResult> {

        try {

            const user = await userModel.findById(id)

            if (user) {

                user.userName = updateData.userName || user.userName
                user.email = updateData.email || user.email
                user.password = updateData.password || user.password
                user.photo = updateData.photo || user.photo
                user.gender = updateData.gender || user.gender
                user.weight = updateData.weight || user.weight
                user.height = updateData.height || user.height
                user.occupation = updateData.occupation || user.occupation
                user.age = updateData.age || user.age
                user.updated_at = new Date

                await user.save()

                return {
                    error: false,
                    statusCode: 200,
                    user: user
                }
            }

            return {
                error: true,
                statusCode: 404,
                message: "Usuário não encontrado"
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async delete(id: string): Promise<IResult> {

        try {

            const user = await userModel.findById(id)

            if (user) {

                user.deleteOne()

                return {
                    error: false,
                    statusCode: 204,
                }
            }

            return {
                error: true,
                statusCode: 404,
                message: "Usuário não encontrado"
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async getByName(name: string): Promise<IResult> {

        try {
            const user = await userModel.find({ userName: { $regex: '.*' + name + '.*', $options: 'i' } }).populate("friends");

            if (user) {
                return {
                    error: false,
                    statusCode: 200,
                    user: user,
                }
            } else {
                return {
                    error: true,
                    statusCode: 500,
                    message: "Usuário não encontrado"
                }
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }

    async removeFriend(friendId: string, userId: string): Promise<IResult> {
        try {
            const user = await userModel.findById(userId);
            const friend = await userModel.findById(friendId);

            if (!user || !friend) {
                throw new Error("Usuário não encontrado.");
            }

            if (!user.friends.includes(friend._id.toString())) {
                throw new Error("Este usuário não é seu amigo.");
            }

            await userModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
            await userModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

            return {
                error: false,
                statusCode: 200,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            };
        }
    }

}