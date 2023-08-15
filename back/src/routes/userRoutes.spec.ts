import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase, resetDatabase } from  '../database/mockDatabase'
import { router } from './router';
import { userModel } from '../models/user';
import UserRepository from '../repositories/UserRepository';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Redis from 'ioredis';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

beforeAll(async () => {
    await connectToTestDatabase();
    await resetDatabase();
});

afterEach(async () => {
    jest.restoreAllMocks();
    const redis = new Redis();
    await redis.flushdb();
    redis.disconnect();
});

afterAll(async () => {
    await closeDatabase();
});

async function createLogin(username: string) {
    const response = await request(app)
    .post('/login')
    .send({
        userName: username,
        password: 'test12345'
    })
    return response.body; 
}

async function createUser(username: string) {
    const user = {
        _id: new mongoose.Types.ObjectId(),
        name: `${username} Surname`,
        userName: username,
        password: 'test12345',
        email: `${username}user@example.com`,
        friends: [],
        photo: 'path-to-photo',
        gender: 'M',
        weight: '70kg',
        height: '175cm',
        occupation: 'Engineer',
        age: 30
    };

    const response = await request(app)
        .post('/users')
        .send(user);
    return response.body 
}

async function createFriendAndAccepts(requester: any, recipient: any) {
    console.log(requester, recipient)
    await userModel.findByIdAndUpdate(requester._id, { $addToSet: { friends: recipient._id } });
    await userModel.findByIdAndUpdate(recipient._id, { $addToSet: { friends: requester._id } });

    return
}

describe('POST /users/', () => {
    it('should successfully create a new user', async () => {
        const user = {
            _id: new mongoose.Types.ObjectId(),
            name: `Test Surname`,
            userName: 'testuser',
            password: 'test12345',
            email: `testuser@example.com`,
            friends: [],
            photo: 'path-to-photo',
            gender: 'M',
            weight: '70kg',
            height: '175cm',
            occupation: 'Engineer',
            age: 30
        };
        
        const response = await request(app)
            .post('/users')
            .send(user);
        
        const user2 = {
            _id: '64db1deb1dfac4f2916ef716',
            name: `Test Surname`,
            userName: 'usertest',
            password: 'test12345',
            email: `testuser@example.com`,
            friends: [],
            photo: 'path-to-photo',
            gender: 'M',
            weight: '70kg',
            height: '175cm',
            occupation: 'Engineer',
            age: 30
        };
        
        await request(app)
            .post('/users')
            .send(user2);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Test Surname');
        expect(response.body.userName).toBe('testuser');
    });

    it('should return 400 when name is invalid', async () => {
        const user = {
            name: '123InvalidName!',
            userName: 'testuser',
            password: 'test12345',
            email: 'testuser@example.com',
        };

        const response = await request(app)
            .post('/users')
            .send(user);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Nome inválido');
    });

    it('should return 400 when email is invalid', async () => {
        const user = {
            name: 'Test User',
            userName: 'testuser',
            password: 'test12345',
            email: 'invalid-email',
        };

        const response = await request(app).post('/users').send(user);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Email inválido');
    });

    it('should return 400 when password is too short', async () => {
        const user = {
            name: 'Test User',
            userName: 'testuser',
            password: '1234',
            email: 'testuser@example.com',
        };

        const response = await request(app).post('/users').send(user);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('password must be at least 5 characters');
    });

    it('should return 400 when age is negative', async () => {
        const user = {
            name: 'Test User',
            userName: 'testuser',
            password: 'test12345',
            email: 'testuser@example.com',
            age: -1,
        };

        const response = await request(app).post('/users').send(user);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Idade inválida');
    });

    it('should return 500 when userName is already taken', async () => {
        const user = {
            _id: new mongoose.Types.ObjectId(),
            name: 'Test User',
            userName: 'testuser',
            password: 'test12345',
            email: 'testuser@example.com',
        };

        await request(app).post('/users').send(user);

        const response = await request(app).post('/users').send(user);

        expect(response.status).toBe(500);
        expect(response.body).toBe("Username já esta sendo utilizado");
    });

    it('should return 500 on generic error', async () => {
        UserRepository.prototype.insert = jest.fn(() => {
            throw new Error('Forced error');
        });

        const user = {
            name: 'Test User',
            userName: 'usertest',
            password: 'test12345',
            email: 'testuser@example.com',
        };

        const response = await request(app).post('/users').send(user);
        expect(response.status).toBe(500);
        expect(response.body).toContain("Forced error");
    });
});

describe('GET /users/search', () => {
    it('should successfully return a user by name', async () => {
        const username = 'testuser'
        await createUser(username)
        const {token} = await createLogin(username);
        const response = await request(app)
            .get(`/users/search?name=${username}`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('userName');
        expect(response.body[0].userName).toContain(username);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .get(`/users/search`)
            .set('Cookie', [`session=wrong`]);
        
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });

    it('should return 400 if no name is provided in the query', async () => {
        await createUser('testuser')
        const {token} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/search`)
            .set('Cookie', [`session=${token}`]);
        
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: true, message: "O nome é obrigatório" });
    });

    it('should return 500 for internal server error', async () => {
        jest.spyOn(UserRepository.prototype, 'getByName').mockRejectedValue(new Error('Forced error'));
        await createUser('testuser')
        const name = 'testuser Surname';
        const {token} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/search?name=${name}`)
            .set('Cookie', [`session=${token}`]);
        
        expect(response.status).toBe(500);
        expect(response.body).toContain("Forced error");
    });
});

describe('GET /users/:id', () => {
    it('should successfully return a user by ID', async () => {
        await createUser('testuser')
        const {token, user} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body.userName).toEqual(user.userName.toString());; 
        expect(response.body._id).toEqual(user._id.toString());
    });

    it('should return 401 if not authenticated', async () => {
        await createUser('testuser')
        const {user} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/${user._id}`)
            .set('Cookie', [`session=wrong`]);
        
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });

    it('should return 400 for invalid ID format', async () => {
        await createUser('testuser')
        const {token} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/invalidIDformat`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: true, message: "ID fornecido é inválido." });
    });

    it('should return 500 for internal server error', async () => {
        UserRepository.prototype.getOne = jest.fn(() => {
            throw new Error('Forced error');
        });
        await createUser('testuser')
        const {token} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/614a25f7e3a77c9f7f5e2488`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain("Forced error");
    });
});

describe('GET /users/', () => {
    it('should successfully retrieve all users', async () => {
        await createUser('testuser')
        const {token, user} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0].name).toContain(user.name);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get(`/users/`);

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt must be provided"});
    });

    it('should return 500 for internal server error', async () => {
        jest.spyOn(UserRepository.prototype, 'get')
            .mockImplementationOnce(() => {
                throw new Error('Forced internal server error');
            });
        await createUser('testuser')
        const {token} = await createLogin('testuser');
        const response = await request(app)
            .get(`/users/`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain('Forced internal server error');
    });
});

describe('PATCH /users/:id', () => {
    it('should successfully update user', async () => {
        await createUser('testuser')
        const { user, token } = await createLogin('testuser');
        const updateData = {
            name: 'New Name',
            email: 'newname@example.com',
            occupation: 'newOccupation',
        };

        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`])
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.userName).toEqual(user.userName);
        expect(response.body.name).toEqual(updateData.name);
        expect(response.body.occupation).toEqual(updateData.occupation);
        expect(response.body.email).toEqual(updateData.email);
        expect(response.body.password).toBeUndefined();
    });

    it('should return 401 if not authenticated', async () => {
        await createUser('testuser')
        const {user} = await createLogin('testuser');
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=wrong`]);
        
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });
    
    it('should return 400 for invalid user ID', async () => {
        await createUser('testuser')
        const { token } = await createLogin('testuser');
        const invalidId = '12345';
        const response = await request(app)
            .patch(`/users/${invalidId}`)
            .set('Cookie', [`session=${token}`]);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ID fornecido é inválido.');
    });

    it('should return 400 for invalid name', async () => {
        await createUser('testuser')
        const { user, token } = await createLogin('testuser');
        const invalidData = {
            name: '123456'
        };
    
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Nome inválido');
    });

    it('should return 400 for invalid email', async () => {
        await createUser('testuser')
        const { user, token } = await createLogin('testuser');
        const invalidData = {
            email: 'invalidEmail'
        };
    
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email inválido');
    });

    it('should return 400 for invalid password', async () => {
        await createUser('testuser')
        const { user, token } = await createLogin('testuser');
        const invalidData = {
            password: 'abc' 
        };
    
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('password must be at least 5 characters');
    });

    it('should return 500 for internal server error', async () => {
        jest.spyOn(UserRepository.prototype, 'update')
            .mockImplementationOnce(() => {
                throw new Error('Forced internal server error');
            });
        await createUser('testuser')
        const {token, user} = await createLogin('testuser');
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Cookie', [`session=${token}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain('Forced internal server error');
    });
});

describe('DELETE /user/:userId/friend/:friendId', () => {
    it('should remove a friend successfully', async () => {
        const friend = await userModel.findById('64db1deb1dfac4f2916ef716')
        const {token, user} = await createLogin('testuser');
        await createFriendAndAccepts(user, friend);
        const response = await request(app)
            .delete(`/user/${user._id}/friend/${friend?._id}`)
            .set('Cookie', `session=${token}`);

        const checkUser = await userModel.findById(user._id)

        expect(response.status).toBe(204);
        expect(checkUser?.friends).toEqual([]);
    });

    it('should return unauthorized if token is invalid', async () => {
        await createUser('testuser')
        const recipient = await createUser('friendtwo');
        const {user} = await createLogin('testuser');
        await createFriendAndAccepts(user, recipient);
        const response = await request(app)
            .delete(`/user/${user._id}/friend/${recipient._id}`)
            .set('Cookie', 'session=invalid_token');

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });

    it('should return not found if friend does not exist', async () => {
        await createUser('testuser')
        await createUser('friendtwo');
        const {token, user} = await createLogin('testuser');
        const response = await request(app)
            .delete(`/user/${user._id}/friend/${new mongoose.Types.ObjectId()}`)
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(500);
        expect(response.body).toBe('Usuário não encontrado.');
    });

    it('should return bad request if user ID or friend ID is invalid', async () => {
        await createUser('testuser')
        const recipient = await createUser('friendtwo');
        const {token, user} = await createLogin('testuser');
        const response = await request(app)
            .delete(`/user/invalid_id/friend/invalid_id`)
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Erro ao remover amizade: Você não pode remover um amigo de outra pessoa.");
    });
})