import UserRepository from './UserRepository';
import { userModel } from '../models/user';
import mongoose from 'mongoose';

describe('UserRepository', () => {
    const mockFriendID = new mongoose.Types.ObjectId().toString()
    const mockUserId = new mongoose.Types.ObjectId().toString()

    const id = "123"

    const mockUser = {
        _id: mockUserId,
        userName: "teste",
        name: "teste",
        password: "teste",
        email: "teste@teste.com",
        friends: [mockFriendID,],
        created_at: new Date,
        updated_at: new Date,
        photo: "url",
        gender: "M",
        weight: "90kg",
        height: "180cm",
        occupation: "none",
        age: 25
    }
    const mockFriend = {
        _id: mockFriendID,
        userName: "teste",
        name: "teste",
        password: "teste",
        email: "teste@teste.com",
        friends: [mockUserId,],
        created_at: new Date,
        updated_at: new Date,
        photo: "url",
        gender: "M",
        weight: "90kg",
        height: "180cm",
        occupation: "none",
        age: 25
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        global.Date = Date;
    });

    it('should insert a user', async () => {
        userModel.create = jest.fn().mockResolvedValue({
            toObject: jest.fn(() => mockUser),
            _id: { toString: jest.fn(() => mockUserId) }
        });

        const userRepository = new UserRepository();
        const user = await userRepository.insert(mockUser);

        expect(userModel.create).toHaveBeenCalledWith(mockUser);
        expect(user).toEqual({ error: false, statusCode: 201, user: { ...mockUser, id: mockUserId } });
    });

    it('should get users', async () => {
        userModel.find = jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(
                    [mockUser, mockUser]
                )
            }))
        }));

        const userRepository = new UserRepository();
        const users = await userRepository.get();

        expect(userModel.find).toHaveBeenCalled();
        expect(users).toEqual({ error: false, statusCode: 200, user: [mockUser, mockUser] });
    });

    it('should get one user', async () => {
        userModel.findById = jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(
                    mockUser
                )
            }))
        }));

        const userRepository = new UserRepository();
        const user = await userRepository.getOne(id);

        expect(userModel.findById).toHaveBeenCalledWith(id);
        expect(user).toEqual({ error: false, statusCode: 200, user: mockUser });
    });

    it('should update a user', async () => {

        userModel.findByIdAndUpdate = jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(
                    { ...updatedUser }
                )
            }))
        }));

        const fixedDate = new Date('2024-01-01T00:00:00');
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

        const advanceDateByOneMinute = () => {
            fixedDate.setMinutes(fixedDate.getMinutes() + 1);
            return new Date(fixedDate);
        }

        const updatedUser = { ...mockUser, userName: 'updated', updated_at: advanceDateByOneMinute(), };

        const userRepository = new UserRepository();
        const user = await userRepository.update(id, { userName: 'updated' });


        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: { userName: "updated" }, updated_at: fixedDate });
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

        const { _id, ...restOfUser } = mockUser

        const userRepository = new UserRepository();
        const result = await userRepository.insert(restOfUser)
        expect(userModel.create).toHaveBeenCalledWith(restOfUser);

        expect(result).toEqual({ "error": true, "message": "Database error", "statusCode": 500 });
    });

    it('should get a user by name', async () => {
        userModel.find = jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(
                    mockUser
                )
            }))
        }));

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({
            $or: [
                { userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } },
                { name: { $regex: '.*' + mockUser.name + '.*', $options: 'i' } }
            ]
        });
        expect(result).toEqual({ error: false, statusCode: 200, user: mockUser });
    });

    it('should return 404 when user is not found', async () => {
        userModel.find = jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockImplementationOnce(() => ({
                populate: jest.fn().mockResolvedValueOnce(
                    []
                )
            }))
        }));

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({
            $or: [
                { userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } },
                { name: { $regex: '.*' + mockUser.name + '.*', $options: 'i' } }
            ]
        });
        expect(result).toEqual({ error: true, statusCode: 404, message: "Usuário não encontrado." });
    });

    it('should handle failure when getting a user by name', async () => {
        userModel.find = jest.fn().mockImplementationOnce(() => {
            throw new Error("Server error");
        });

        const userRepository = new UserRepository();
        const result = await userRepository.getByName(mockUser.userName);

        expect(userModel.find).toHaveBeenCalledWith({
            $or: [
                { userName: { $regex: '.*' + mockUser.userName + '.*', $options: 'i' } },
                { name: { $regex: '.*' + mockUser.name + '.*', $options: 'i' } }
            ]
        });
        expect(result).toEqual({
            error: true,
            message: 'Server error',
            statusCode: 500,
        });
    });

    it('should remove a friend', async () => {
        userModel.findById = jest.fn()
            .mockReturnValueOnce(Promise.resolve(mockUser))
            .mockReturnValueOnce(Promise.resolve(mockFriend));

        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        const userRepository = new UserRepository();
        const result = await userRepository.removeFriend(mockFriendID.toString(), mockUserId.toString());

        expect(userModel.findById).toHaveBeenNthCalledWith(1, mockUserId);
        expect(userModel.findById).toHaveBeenNthCalledWith(2, mockFriendID);
        expect(userModel.findByIdAndUpdate).toHaveBeenNthCalledWith(1, mockUserId, { $pull: { friends: mockFriendID } });
        expect(userModel.findByIdAndUpdate).toHaveBeenNthCalledWith(2, mockFriendID, { $pull: { friends: mockUserId } });

        expect(result).toEqual({ error: false, statusCode: 204 });
    });

    it('should throw an error when the user or friend does not exist', async () => {
        userModel.findById = jest.fn()
            .mockReturnValueOnce(Promise.resolve(null))
            .mockReturnValueOnce(Promise.resolve(null));

        const userRepository = new UserRepository();
        const result = await userRepository.removeFriend(mockFriendID, mockUserId);

        expect(userModel.findById).toHaveBeenNthCalledWith(1, mockUserId);
        expect(userModel.findById).toHaveBeenNthCalledWith(2, mockFriendID);
        expect(result).toEqual({
            error: true,
            message: "Usuário não encontrado.",
            statusCode: 500,
        });
    });

    it('should throw an error when the user is not a friend of the friend', async () => {
        const mockUserWithoutFriend = {
            ...mockUser,
            friends: [],
        };

        userModel.findById = jest.fn()
            .mockReturnValueOnce(Promise.resolve(mockUserWithoutFriend))
            .mockReturnValueOnce(Promise.resolve(mockFriend));

        const userRepository = new UserRepository();
        const result = await userRepository.removeFriend(mockFriendID, mockUserId);

        expect(userModel.findById).toHaveBeenNthCalledWith(1, mockUserId);
        expect(userModel.findById).toHaveBeenNthCalledWith(2, mockFriendID);
        expect(result).toEqual({
            error: true,
            message: "Este usuário não é seu amigo.",
            statusCode: 500,
        });
    });

});