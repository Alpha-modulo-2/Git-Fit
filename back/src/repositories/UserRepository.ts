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
                    message: "User not Found"
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
                message: "User not found"
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
                message: "User not found"
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }
}