import IResult from "../interfaces/IResult";
import IUpdateData from "../interfaces/IUpdateUserData";
import IUser from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";

export default class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository = new UserRepository()) {
        this.repository = repository;
    }

    async insert(user: IUser): Promise<IResult> {

        try {

            if (!user || !user.password) {
                const error = {
                    message: "Corpo da requisição nao contem os campos necessários.",
                    code: 500
                }

                throw error
            }

            const passwordHash = await bcrypt.hash(user.password, 10);

            const result = await this.repository.insert({ ...user, password: passwordHash });
            let error;

            if (result.error) {

                const message = result.message as string
                if (message.includes("E11000")) {
                    error = {
                        message: "Username já esta sendo utilizado",
                        code: 500
                    }

                } else {
                    error = {
                        message: result.message,
                        code: result.statusCode
                    }
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }

    }

    async get(): Promise<IResult> {
        try {
            const result = await this.repository.get();

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }

    async getOne(id: string): Promise<IResult> {
        try {

            const result = await this.repository.getOne(id);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }

    async update(id: string, updateData: IUpdateData): Promise<IResult> {

        try {
            let reqData = { ...updateData }

            if (updateData.password) {
                const passwordHash = await bcrypt.hash(updateData.password, 10);
                reqData = { ...updateData, password: passwordHash }
            }

            const result = await this.repository.update(id, { ...reqData });

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }

    async delete(id: string): Promise<IResult> {

        try {
            const result = await this.repository.delete(id);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }

    }

    async getByName(name: string): Promise<IResult> {
        try {

            const result = await this.repository.getByName(name);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }

    async removeFriend(friendId: string, userId: string): Promise<IResult> {
        try {

            const result = await this.repository.removeFriend(friendId, userId);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }
}
