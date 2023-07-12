import { ObjectId } from "mongodb";
import { collections } from "../database/database";
import User from "../models/user";

export default class UserRepository {
    async insert(user: User) {
        try {

            const result = await collections.users?.insertOne(user);

            return result
        } catch (error: any) {


        }
    }

    async get() {
        try {

            const users = await collections.users?.find({}).toArray();

            return users
        } catch (error: any) {


        }
    }

    async getOne(id: string) {

        try {

            const query = { _id: new ObjectId(id) };
            const user = await collections.users?.findOne(query);

            if (user) {
                console.log(user);

                return user;
            }
        } catch (error: any) {

        }
    }
}
