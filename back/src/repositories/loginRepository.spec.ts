import LoginRepository from "../repositories/loginRepository";
import { userModel } from "../models/user";
import ILogin from "../interfaces/ILogin";
import mongoose from "mongoose";

jest.mock('../models/user');

describe('LoginRepository', () => {
    const mockCredentials: ILogin = {
        userName: "test",
        password: "password"
    };

    const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        userName: mockCredentials.userName,
        email: "teste@teste.com",
        friends: [""],
        created_at: new Date,
        updated_at: new Date,
        photo: "url",
        gender: "M",
        weight: "90kg",
        height: "180cm",
        occupation: "none",
        age: 25
    };

    beforeEach(() => {
        (userModel.findOne as jest.Mock).mockImplementation(async () => mockUser);
    });

    it('should login a user', async () => {
        const loginRepository = new LoginRepository();

        userModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn(() => ({
                toObject: () => mockUser
            }))
        });

        const result = await loginRepository.login(mockCredentials);

        expect(userModel.findOne).toHaveBeenCalledWith({ userName: mockCredentials.userName });
        expect(result).toEqual({ error: false, statusCode: 200, user: mockUser });
    });

    it('should fail to login when user is not found', async () => {
        userModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn(() => null)
        });

        const loginRepository = new LoginRepository();

        const result = await loginRepository.login(mockCredentials);

        expect(result).toEqual({ error: true, message: 'Usuário ou senha incorretos.', statusCode: 500 });
    });
});