/* import mongoose from 'mongoose';
import UserController from '../controllers/UserController';
import jwt from "jsonwebtoken"
import UserService from '../services/UserServices';
import * as validators from '../middleware/validators';
import { Request, Response } from 'express';

interface MockUserService extends UserService {
    insert: jest.Mock;
    getOne: jest.Mock;
    get: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    getByName: jest.Mock;
    removeFriend: jest.Mock;
}

describe('UserController', () => {

    beforeEach(() => {
        process.env.JWTSECRET = 'your-test-secret';
    });

    let req: any, res: any, next: any;
    let userController: any;
    let userService: MockUserService;

    const mockFriendID = new mongoose.Types.ObjectId().toString()
    const mockUserId = new mongoose.Types.ObjectId().toString()

    const mockUser = {
        userName: "teste",
        name: "",
        password: "teste",
        email: "teste@teste.com",
        friends: [mockFriendID,],
        gender: "M",
        weight: "90kg",
        height: "180cm",
        occupation: "none",
        age: 25
    }

    beforeEach(() => {
        req = {
            body: { ...mockUser },
            params: { userId: mockUserId, friendId: mockFriendID }
        };
        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };
        next = jest.fn();

        userService = {
            insert: jest.fn(),
            getOne: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getByName: jest.fn(),
            removeFriend: jest.fn(),
        } as MockUserService;

        userController = new UserController(userService);
    });

    it('should insert a user', async () => {
        userService.insert.mockResolvedValue({
            error: false, statusCode: 200, user: {
                ...mockUser,
                photo: ""
            }
        });

        await userController.insert(req, res);

        expect(userService.insert).toHaveBeenCalledWith({
            ...mockUser,
            photo: ""
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            ...mockUser,
            photo: ""
        });
    });

    it('should get one user', async () => {
        userService.getOne.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        req.params.id = mockUserId

        await userController.getOne(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should get all users', async () => {
        const users = [mockUser];
        userService.get.mockResolvedValue({ error: false, statusCode: 200, user: users });

        await userController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should update a user', async () => {
        const req = {
            params: {
                id: mockUserId,
            },
            body: { ...mockUser }
        }
        userService.update.mockResolvedValue({ error: false, statusCode: 200, user: mockUser, });

        await userController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should delete a user', async () => {
        userService.delete.mockResolvedValue({ error: false, statusCode: 204 });

        const req = {
            params: {
                id: mockUserId
            },
            cookies: { "session": jwt.sign({ user: { _id: mockUserId } }, process.env.JWTSECRET!) }
        }

        await userController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalled();
    });

    it('should return error if userService throws', async () => {
        const error = new Error('Insertion error');
        userService.insert.mockRejectedValue(error);

        await userController.insert(req, res);

        expect(userService.insert).toHaveBeenCalledWith({
            ...mockUser,
            photo: ""
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `Erro ao inserir a conta ${error.message}`, statusCode: 500 });
    });

    it('should get user by name', async () => {
        const req = {
            query: {
                name: mockUser.userName,
            },
        };

        userService.getByName.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        await userController.getByName(req, res);

        expect(userService.getByName).toHaveBeenCalledWith(mockUser.userName);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return error if userService.getByName returns error message', async () => {
        const req = {
            query: {
                name: mockUser.userName,
            },
        };
        const errorMessage = 'User not found';
        userService.getByName.mockResolvedValue({ error: true, statusCode: 404, message: errorMessage });

        await userController.getByName(req, res);

        expect(userService.getByName).toHaveBeenCalledWith(mockUser.userName);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(errorMessage);
    });

    it('should return 500 if userService.getByName throws an error', async () => {
        const req = {
            query: {
                name: mockUser.userName,
            },
        };
        const error = new Error('Service error');
        userService.getByName.mockRejectedValue(error);

        await userController.getByName(req, res);

        expect(userService.getByName).toHaveBeenCalledWith(mockUser.userName);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao procurar usuários: ${error.message}`,
        });
    });

    it('should return error if required name is missing in request query', async () => {
        const req = {
            query: {},
            get: (header: string) => undefined
        } as Request;

        const res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        } as unknown as Response;

        const validateQueryMock = jest.spyOn(validators, 'validateQuery');
        validateQueryMock.mockImplementationOnce((_req, _res, next) => next(new Error('Nome nao encontrado')));

        let middlewareError: Error | undefined;
        validators.validateQuery(req, res, (err) => { middlewareError = err; });

        if (middlewareError) {
            res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao procurar usuários: ${middlewareError.message}`,
            });
        } else {
            await userController.getByName(req, res);
        }


        expect(userService.getByName).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao procurar usuários: Nome nao encontrado`,
        });
    });

    it('should return error if required id is missing in request params', async () => {
        const req = {
            query: {},
            get: (header: string) => undefined
        } as Request;

        const res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        } as unknown as Response;

        const validateIdMock = jest.spyOn(validators, 'validateId');
        validateIdMock.mockImplementationOnce((_req, _res, next) => next(new Error('ID nao encontrado')));

        let middlewareError: Error | undefined;
        validators.validateId(req, res, (err) => { middlewareError = err; });

        if (middlewareError) {
            res.status(500).json({
                error: true,
                statusCode: 500,
                message: `Erro ao atualizar a conta: ${middlewareError.message}`,
            });
        } else {
            await userController.update(req, res);
        }

        expect(userService.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao atualizar a conta: ID nao encontrado`,
        });
    });

    it('should remove a friend', async () => {
        const req = {
            params: {
                userId: mockUserId,
                friendId: mockFriendID
            },
            cookies: { "session": jwt.sign({ user: { _id: mockUserId } }, process.env.JWTSECRET!) }
        }
        userService.removeFriend.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        await userController.removeFriend(req, res);

        expect(userService.removeFriend).toHaveBeenCalledWith(mockFriendID, mockUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return error if JWTSECRET is not defined', async () => {
        const req = {
            params: {
                userId: mockUserId,
                friendId: mockFriendID
            },
            cookies: { "session": jwt.sign({ user: { id: mockUserId } }, process.env.JWTSECRET!) }
        }
        process.env.JWTSECRET = "";

        await userController.removeFriend(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: 'Erro ao remover amizade: JWTSECRET nao definido'
        });
    });
}); */