import IResult from "../interfaces/IResult";
import IUpdateData from "../interfaces/IUpdateUserData";
import IUser from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository = new UserRepository()) {
        this.repository = repository;
    }

    async insert(user: IUser): Promise<IResult> {

        try {
            const result = await this.repository.insert(user);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }

    }

    async get(): Promise<IResult> {
        try {
            const result = await this.repository.get();

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }
    }

    async getOne(id: string): Promise<IResult> {
        try {

            const result = await this.repository.getOne(id);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }

    }

    async update(id: string, updateData: IUpdateData): Promise<IResult> {

        try {
            const result = await this.repository.update(id, updateData);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }

    }

    async delete(id: string): Promise<IResult> {

        try {
            const result = await this.repository.delete(id);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }

    }

    async getByName(name: string): Promise<IResult> {
        try {

            const result = await this.repository.getByName(name);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return error.message;
        }

    }
}
