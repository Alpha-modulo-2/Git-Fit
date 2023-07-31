import UserService from './UserServices';
import UserRepository from '../repositories/UserRepository';
import IUser from '../interfaces/IUser';

jest.mock('../repositories/UserRepository');

const user: IUser = {
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

const users: IUser[] = [user, user, user]

describe('UserService', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepository);
    });

    it('should insert a user', async () => {
        const newUser = { ...user, userName: "outro" };
        userRepository.insert.mockResolvedValue({ error: false, statusCode: 201, user: newUser });

        const result = await userService.insert(newUser);

        expect(result).toEqual({ error: false, statusCode: 201, user: newUser });
        expect(userRepository.insert).toHaveBeenCalledWith(newUser);
    });

    it('should get users', async () => {
        userRepository.get.mockResolvedValue({ error: false, statusCode: 200, user: users });

        const result = await userService.get();

        expect(result).toEqual({ error: false, statusCode: 200, user: users });
        expect(userRepository.get).toHaveBeenCalled();
    });

    it('should get one user', async () => {
        const id = '123';
        userRepository.getOne.mockResolvedValue({ error: false, statusCode: 200, user });

        const result = await userService.getOne(id);

        expect(result).toEqual({ error: false, statusCode: 200, user });
        expect(userRepository.getOne).toHaveBeenCalledWith(id);
    });

    it('should update a user', async () => {
        const id = '123';
        const updateData = { userName: 'Updated' };
        userRepository.update.mockResolvedValue({ error: false, statusCode: 200, user: { ...user, ...updateData } });

        const result = await userService.update(id, updateData);

        expect(result).toEqual({ error: false, statusCode: 200, user: { ...user, ...updateData } });
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

        const result = await userService.insert(user);

        expect(result).toEqual({ error: true, message: "Server error", statusCode: 500 });
        expect(userRepository.insert).toHaveBeenCalledWith(user);
    });

    it('should not insert a user without required fields', async () => {
        const newUser = { ...user, userName: "" };
        userRepository.insert.mockResolvedValue({ error: true, message: 'userName is required', statusCode: 500 });

        const result = await userService.insert(newUser);

        expect(result).toEqual({ error: true, message: 'userName is required', statusCode: 500 });
        expect(userRepository.insert).toHaveBeenCalledWith(newUser);
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
        userRepository.getByName.mockResolvedValue({ error: false, statusCode: 200, user });

        const result = await userService.getByName(userName);

        expect(result).toEqual({ error: false, statusCode: 200, user });
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
});