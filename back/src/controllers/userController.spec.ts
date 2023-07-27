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
        } as MockUserService;

        userController = new UserController(userService);
    });

    it('should insert a user', async () => {
        userService.insert.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });
        (UserValidator as jest.Mock).mockReturnValue({});
        (bcrypt.hash as jest.Mock).mockReturnValue('hashedPassword');

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
});