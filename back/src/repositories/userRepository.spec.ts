import UserRepository from './UserRepository';
import { userModel } from '../models/user';
import IUser from '../interfaces/IUser';

const id = "123"

const mockUser: IUser = {
    "userName": "teste",
    "password": "teste",
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
}

describe('UserRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should insert a user', async () => {
        userModel.create = jest.fn().mockResolvedValue(mockUser);

        const userRepository = new UserRepository();
        const user = await userRepository.insert(mockUser);

        expect(userModel.create).toHaveBeenCalledWith(mockUser);
        expect(user).toEqual({ error: false, statusCode: 201, user: mockUser });
    });

    it('should get users', async () => {
        userModel.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([mockUser, mockUser]),
            exec: jest.fn().mockResolvedValue({ error: false, statusCode: 200, user: [mockUser, mockUser] })
        });

        const userRepository = new UserRepository();
        const users = await userRepository.get();

        expect(userModel.find).toHaveBeenCalled();
        expect(users).toEqual({ error: false, statusCode: 200, user: [mockUser, mockUser] });
    });

    it('should get one user', async () => {
        userModel.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockUser),
            exec: jest.fn().mockResolvedValue({ error: false, statusCode: 200, user: mockUser })
        })

        const userRepository = new UserRepository();
        const user = await userRepository.getOne(id);

        expect(userModel.findById).toHaveBeenCalledWith(id);
        expect(user).toEqual({ error: false, statusCode: 200, user: mockUser });
    });

    it('should update a user', async () => {
        const fixedDate = new Date('2024-01-01T00:00:00');

        const advanceDateByOneMinute = () => {
            fixedDate.setMinutes(fixedDate.getMinutes() + 1);
            return new Date(fixedDate);
        }

        const updatedUser = { ...mockUser, userName: 'updated' };

        userModel.findById = jest.fn().mockResolvedValue({
            ...mockUser,
            updated_at: advanceDateByOneMinute(),
            save: jest.fn().mockResolvedValue({ ...updatedUser }),
            populate: jest.fn().mockReturnThis(),
        });

        const userRepository = new UserRepository();
        const user = await userRepository.update(id, { userName: 'updated' });


        expect(userModel.findById).toHaveBeenCalledWith(id);
        expect(user).toEqual({ error: false, statusCode: 200, user: { ...user.user } });
    });

    it('should delete a user', async () => {
        userModel.findById = jest.fn().mockReturnValue({
            ...mockUser,
            deleteOne: jest.fn().mockResolvedValue(true)
        });

        const userRepository = new UserRepository();
        const result = await userRepository.delete(id);

        expect(userModel.findById).toHaveBeenCalledWith(id);
        expect(result).toEqual({ error: false, statusCode: 204 });
    });

    it('should handle failure when inserting a user', async () => {
        userModel.create = jest.fn().mockRejectedValue(new Error('Database error'));

        const userRepository = new UserRepository();
        const result = await userRepository.insert(mockUser)
        expect(userModel.create).toHaveBeenCalledWith(mockUser);

        expect(result).toEqual({ "error": true, "message": "Database error", "statusCode": 500 });
    });

    it('should get a user by name', async () => {
        userModel.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockUser),
            exec: jest.fn().mockResolvedValue({ error: false, statusCode: 200, user: mockUser })
        })

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({ userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } });
        expect(result).toEqual({ error: false, statusCode: 200, user: mockUser });
    });

    it('should return when user is not found', async () => {
        userModel.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([]),
            exec: jest.fn().mockResolvedValue({ error: false, statusCode: 200, user: [] })
        })

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({ userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } });
        expect(result).toEqual({ error: false, statusCode: 200, user: [] });
    });

    it('should handle failure when getting a user by name', async () => {
        userModel.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue({ message: "Server error" }),
            exec: jest.fn().mockRejectedValue({ message: 'Server error' })
        })

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({ userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } });
        expect(result).toEqual({
            error: true,
            message: 'Server error',
            statusCode: 500,
        });
    });
});