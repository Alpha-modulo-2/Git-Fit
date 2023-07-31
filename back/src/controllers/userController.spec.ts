import UserController from '../controllers/UserController';
import IUser from '../interfaces/IUser';
import UserService from '../services/UserServices';
import UserValidator from '../validators/UserValidator';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('../validators/UserValidator'); // Mock UserValidator

interface MockUserService extends UserService {
    insert: jest.Mock;
    getOne: jest.Mock;
    get: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    getByName: jest.Mock;
}

describe('UserController', () => {
    let req: any, res: any, next: any;
    let userController: any;
    let userService: MockUserService;

    const mockUser: IUser = {
        "id": "123456789101112131415161",
        "userName": "teste",
        "password": "teste123",
        "email": "teste@teste.com",
        "friends": [""],
        "created_at": new Date,
        "updated_at": new Date,
        "photo": "url",
        "gender": "M",
        "weight": "90kg",
        "height": "180cm",
        "occupation": "none",
        "age": 25
    };

    beforeEach(() => {
        req = { body: { ...mockUser }, params: {} };
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
        } as MockUserService;

        userController = new UserController(userService);
        (UserValidator as jest.Mock).mockReturnValue({});
        (bcrypt.hash as jest.Mock).mockReturnValue('hashedPassword');
    });

    it('should insert a user', async () => {
        userService.insert.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        await userController.insert(req, res);

        expect(UserValidator).toHaveBeenCalledWith(mockUser);
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
        expect(userService.insert).toHaveBeenCalledWith({ ...mockUser, password: 'hashedPassword' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should get one user', async () => {
        userService.getOne.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

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
        const { id, ...restOfUser } = mockUser
        const req = {
            params: {
                id: id,
            },
            body: { ...restOfUser }
        }
        userService.update.mockResolvedValue({ error: false, statusCode: 200, user: restOfUser, });

        await userController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(restOfUser);
    });

    it('should delete a user', async () => {
        userService.delete.mockResolvedValue({ error: false, statusCode: 204 });

        await userController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalled();
    });

    it('should return error if validator throws', async () => {
        const error = new Error('Validation error');
        (UserValidator as jest.Mock).mockImplementation(() => { throw error; });

        await userController.insert(req, res);

        expect(UserValidator).toHaveBeenCalledWith(mockUser);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `Erro ao inserir a conta ${error.message}`, statusCode: 500 });
    });

    it('should return error if userService throws', async () => {
        const error = new Error('Insertion error');
        userService.insert.mockRejectedValue(error);

        await userController.insert(req, res);

        expect(userService.insert).toHaveBeenCalledWith({ ...mockUser, password: 'hashedPassword' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `Erro ao inserir a conta ${error.message}`, statusCode: 500 });
    });

    it('should return error if request body is invalid', async () => {
        const req = { body: {} };
        const error = new Error('Request body is invalid');
        (UserValidator as jest.Mock).mockReturnValue({ error: error });


        await userController.insert(req, res);

        expect(userService.insert).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: { error: error } });
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
            message: `Erro ao inserir a conta ${error.message}`,
        });
    });

    it('should return error if required name is missing in request query', async () => {
        const req = { query: {} };
        const error = new Error('Nome nao encontrado');


        await userController.getByName(req, res);

        expect(userService.getByName).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao inserir a conta ${error.message}`,
        });
    });

    it('should return error if required id is missing in request params', async () => {
        const req = { params: {}, body: mockUser };
        const error = new Error('Id nao encontrada');

        await userController.update(req, res);

        expect(userService.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao atualizar a conta 1 ${error.message}`,
        });
    });
});