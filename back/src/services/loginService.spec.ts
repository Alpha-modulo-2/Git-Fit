import LoginService from '../services/loginService';
import LoginRepository from '../repositories/loginRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IUser from '../interfaces/IUser';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

interface MockLoginRepository extends LoginRepository {
    login: jest.Mock;
}

describe('LoginService', () => {
    let loginService: LoginService;
    let loginRepository: MockLoginRepository;

    const mockCredentials = {
        userName: "test",
        password: "password"
    };

    const mockUser: IUser = {
        _id: "123456789101112131415161",
        userName: mockCredentials.userName,
        name: "teste",
        password: '$2a$10$yH.C8uIjC.O9F5/RLKmKMu9JqG2tUzBLpLuJ.bfO6ZJ5V7oQ.tolC', // bcrypt hashed version of "password"
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

    const restOfUser: IUser = {
        userName: mockUser.userName,
        name: mockUser.name,
        _id: mockUser._id,
        email: mockUser.email,
        photo: mockUser.photo,
        gender: mockUser.gender,
        weight: mockUser.weight,
        height: mockUser.height,
        occupation: mockUser.occupation,
        age: mockUser.age,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
        friends: mockUser.friends
    }

    beforeEach(() => {
        loginRepository = {
            login: jest.fn()
        } as MockLoginRepository;

        loginService = new LoginService(loginRepository);

        // Mocking bcrypt.compare to return true as if the password matched
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('token');
        process.env.JWTSECRET = 'secret';
    });

    it('should login a user', async () => {
        loginRepository.login.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        const result = await loginService.login(mockCredentials);

        expect(loginRepository.login).toHaveBeenCalledWith(mockCredentials);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockCredentials.password, mockUser.password);
        expect(jwt.sign).toHaveBeenCalledWith({
            restOfUser: restOfUser
        }, process.env.JWTSECRET, { expiresIn: "336h" });
        expect(result).toEqual({
            error: false, user: restOfUser, statusCode: 200, data: 'token'
        });
    });

    it('should fail to login when repository throws an error', async () => {
        loginRepository.login.mockRejectedValue(new Error('Usuário ou senha incorretos.'));

        const result = await loginService.login(mockCredentials);

        expect(result).toEqual({ error: true, message: "Usuário ou senha incorretos.", statusCode: 500 });
    });

    it('should fail to login when bcrypt.compare fails', async () => {
        loginRepository.login.mockRejectedValue(new Error("Usuário ou senha incorretos."));

        bcrypt.compare = jest.fn().mockReturnValue(false);  // Passwords do not match

        const result = await loginService.login(mockCredentials);

        expect(result).toEqual({ error: true, message: "Usuário ou senha incorretos.", statusCode: 500 });
    });
});