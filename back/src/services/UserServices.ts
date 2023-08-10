import IResult from "../interfaces/IResult";
import IUpdateData from "../interfaces/IUpdateUserData";
import IUser from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";
import CardService from "./CardServices";

export default class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository = new UserRepository()) {
        this.repository = repository;
    }

    async insert(user: IUser): Promise<IResult> {

        try {
            const result = await this.repository.insert(user);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            const createdUser: IUser = result.user as IUser;

            if (createdUser.id !== undefined) {
                const cardService = new CardService();
                const cardResult = await cardService.insert(createdUser.id);
    
                if (cardResult.error) {
                    const error = {
                        message: result.message,
                        code: result.statusCode
                    }
                    throw error
                }
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
            const result = await this.repository.update(id, updateData);

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
