import User from "../models/user";
import UserRepository from "../repositories/UserRepository";

export default class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async insert(user: User) {
        try {
            const result = await this.repository.insert(user);
            return result
        } catch (error: any) {
        }

        return;
    }

    async get() {
        try {
            const result = await this.repository.get();
            return result
        } catch (error: any) {

        }

        return;
    }

    async getOne(id: string) {
        try {

            const result = await this.repository.getOne(id);
            return result
        } catch (error: any) {

        }

        return;
    }
}
