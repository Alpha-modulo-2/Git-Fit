import UserService from './UserServices';
import UserRepository from '../repositories/UserRepository';
import IUser from '../interfaces/IUser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { cardCronJob } from '../repositories/CardRepository';

jest.mock('../repositories/UserRepository');
jest.mock('bcrypt');

describe('UserService', () => {
    const mockFriendID = new mongoose.Types.ObjectId().toString()
    const mockUserId = new mongoose.Types.ObjectId().toString()

    const mockUser = {
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

    const users: IUser[] = [mockUser, mockUser, mockUser]

    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepository);
        process.env.JWTSECRET = 'your-test-secret';
        (bcrypt.hash as jest.Mock).mockReturnValue('hashedPassword');

    });

    afterAll(async () => {
        cardCronJob.stop()
    });

    it('should insert a user', async () => {
        const newUser = { ...mockUser, userName: "outro" };
        userRepository.insert.mockResolvedValue({ error: false, statusCode: 201, user: newUser });

        const result = await userService.insert(newUser);

        expect(result).toEqual({ error: false, statusCode: 201, user: newUser });
        expect(userRepository.insert).toHaveBeenCalledWith({ ...newUser, password: "hashedPassword" });
    });

    it('should get users', async () => {
        userRepository.get.mockResolvedValue({ error: false, statusCode: 200, user: users });

        const result = await userService.get();

        expect(result).toEqual({ error: false, statusCode: 200, user: users });
        expect(userRepository.get).toHaveBeenCalled();
    });

    it('should get one user', async () => {
        const id = '123';
        userRepository.getOne.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        const result = await userService.getOne(id);

        expect(result).toEqual({ error: false, statusCode: 200, user: mockUser });
        expect(userRepository.getOne).toHaveBeenCalledWith(id);
    });

    it('should update a user', async () => {
        const id = '123';
        const updateData = { userName: 'Updated' };
        userRepository.update.mockResolvedValue({ error: false, statusCode: 200, user: { ...mockUser, userName: 'Updated' } });

        const result = await userService.update(id, { ...updateData });

        expect(result).toEqual({ error: false, statusCode: 200, user: { ...mockUser, userName: 'Updated' } });
        expect(userRepository.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should delete a user', async () => {
        const id = '123';
        userRepository.delete.mockResolvedValue({ error: false, statusCode: 204 });

        const result = await userService.delete(id);

        expect(result).toEqual({ error: false, statusCode: 204 });
        expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should handle error when inserting a user', async () => {
        userRepository.insert.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await userService.insert(mockUser);

        expect(result).toEqual({ error: true, message: "Server error", statusCode: 500 });
        expect(userRepository.insert).toHaveBeenCalledWith({ ...mockUser, password: "hashedPassword" });
    });

    it('should not insert a user without required fields', async () => {
        const newUser = { ...mockUser, userName: "" };
        userRepository.insert.mockResolvedValue({ error: true, message: 'userName is required', statusCode: 500 });

        const result = await userService.insert(newUser);

        expect(result).toEqual({ error: true, message: 'userName is required', statusCode: 500 });
        expect(userRepository.insert).toHaveBeenCalledWith({ ...newUser, password: "hashedPassword" });
    });

    it('should handle error when getting all users', async () => {
        userRepository.get.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await userService.get();

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(userRepository.get).toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
        const id = '123';
        userRepository.getOne.mockResolvedValue({ error: true, message: 'user not found', statusCode: 404 });

        const result = await userService.getOne(id);

        expect(result).toEqual({ error: true, message: 'user not found', statusCode: 404 });
        expect(userRepository.getOne).toHaveBeenCalledWith(id);
    });

    it('should not update a user without required fields', async () => {
        const id = '123';
        const updateData = { userName: '' };
        userRepository.update.mockResolvedValue({ error: true, message: 'userName is required', statusCode: 400 });

        const result = await userService.update(id, updateData);

        expect(result).toEqual({ error: true, message: 'userName is required', statusCode: 400 });
        expect(userRepository.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should handle error when updating a user', async () => {
        const id = '123';
        const updateData = { userName: 'Updated' };
        userRepository.update.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await userService.update(id, updateData);

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(userRepository.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should handle error when deleting a user', async () => {
        const id = '123';
        userRepository.delete.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await userService.delete(id);

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should handle user not found when deleting', async () => {
        const id = '123';
        userRepository.delete.mockResolvedValue({ error: true, message: 'user not found', statusCode: 404 });

        const result = await userService.delete(id);

        expect(result).toEqual({ error: true, message: 'user not found', statusCode: 404 });
        expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should get user by name', async () => {
        const userName = 'TestUser';
        userRepository.getByName.mockResolvedValue({ error: false, statusCode: 200, user: mockUser });

        const result = await userService.getByName(userName);

        expect(result).toEqual({ error: false, statusCode: 200, user: mockUser });
        expect(userRepository.getByName).toHaveBeenCalledWith(userName);
    });

    it('should handle user not found when getting by name', async () => {
        const userName = 'TestUser';
        userRepository.getByName.mockResolvedValue({ error: false, statusCode: 200, user: [] });

        const result = await userService.getByName(userName);

        expect(result).toEqual({ error: false, statusCode: 200, user: [] });
        expect(userRepository.getByName).toHaveBeenCalledWith(userName);
    });

    it('should handle error when getting user by name', async () => {
        const userName = 'TestUser';
        userRepository.getByName.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await userService.getByName(userName);

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(userRepository.getByName).toHaveBeenCalledWith(userName);
    });

    it('should remove a friend', async () => {
        userRepository.removeFriend.mockResolvedValue({ error: false, statusCode: 200 })

        const result = await userService.removeFriend(mockFriendID, mockUserId);

        expect(userRepository.removeFriend).toHaveBeenCalledWith(mockFriendID, mockUserId);
        expect(result).toEqual({ error: false, statusCode: 200 });
    });

    it('should handle repository error', async () => {
        const mockRepositoryResult = {
            error: true,
            message: "Error message",
            statusCode: 404
        };
        userRepository.removeFriend.mockResolvedValue(mockRepositoryResult)

        const result = await userService.removeFriend(mockFriendID, mockUserId);

        expect(userRepository.removeFriend).toHaveBeenCalledWith(mockFriendID, mockUserId);
        expect(result).toEqual({
            error: true,
            message: mockRepositoryResult.message,
            statusCode: mockRepositoryResult.statusCode
        });
    });

    it('should handle unexpected error', async () => {
        userRepository.removeFriend.mockRejectedValue(new Error('Unexpected error'))

        const result = await userService.removeFriend(mockFriendID, mockUserId);

        expect(userRepository.removeFriend).toHaveBeenCalledWith(mockFriendID, mockUserId);
        expect(result).toEqual({
            error: true,
            message: "Unexpected error",
            statusCode: 500
        });
    });
});