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
import jwtLib from "jsonwebtoken";
import bcrypt from "bcrypt";

let redis: any

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

beforeAll(async () => {
    await connectToTestDatabase();
});

beforeEach(async () => {
    redis = new Redis();
})

afterEach(async () => {
    jest.restoreAllMocks();
    await redis.flushdb();
    redis.disconnect();
    await resetDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

async function createUser(username: string) {
    const passwordHash = await bcrypt.hash('test12345', 10);
    
    const user = {
        name: `${username} Surname`,
        userName: username,
        password: passwordHash,
        email: `${username}user@example.com`,
        friends: [],
        photo: 'path-to-photo',
        gender: 'M',
        weight: '70kg',
        height: '175cm',
        occupation: 'Engineer',
        age: 30
    };

    const result = await userModel.create(user)
    
    const jwt = jwtLib.sign(
        { user: result },
        process.env.JWTSECRET
    );

    const retrievedUsers = await userModel.find({});
    //console.log('create', retrievedUsers)
    return { jwt, result };
}

async function createFriendAndAccepts(requester: any, recipient: any) {
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
        const username = 'usuarioteste'
        const { jwt } = await createUser(username)
        const response = await request(app)
            .get(`/users/search?name=${username}`)
            .set('Cookie', [`session=${jwt}`]);

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
        const { jwt } = await createUser('usuarioteste')
        const response = await request(app)
            .get(`/users/search`)
            .set('Cookie', [`session=${jwt}`]);
        
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: true, message: "O nome é obrigatório" });
    });

    it('should return 500 for internal server error', async () => {
        jest.spyOn(UserRepository.prototype, 'getByName').mockRejectedValue(new Error('Forced error'));
        const { jwt, result } = await createUser('usuarioteste')
        const response = await request(app)
            .get(`/users/search?name=usuarioteste`)
            .set('Cookie', [`session=${jwt}`]);
        
        expect(response.status).toBe(500);
        expect(response.body).toContain("Forced error");
    });
});

describe('GET /users/:id', () => {
    it('should successfully return a user by ID', async () => {
        const { jwt, result } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(200);
        expect(response.body.userName).toEqual(result.userName.toString());; 
        expect(response.body._id).toEqual(result._id.toString());
    });

    it('should return 401 if not authenticated', async () => {
        const { result } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/${result._id}`)
            .set('Cookie', [`session=wrong`]);
        
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });

    it('should return 400 for invalid ID format', async () => {
        const { jwt } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/invalidIDformat`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: true, message: "ID fornecido é inválido." });
    });

    it('should return 500 for internal server error', async () => {
        UserRepository.prototype.getOne = jest.fn(() => {
            throw new Error('Forced error');
        });
        const { jwt } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/614a25f7e3a77c9f7f5e2488`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain("Forced error");
    });
});

describe('GET /users/', () => {
    it('should successfully retrieve all users', async () => {
        const { jwt, result } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0].name).toContain(result.name);
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
        const { jwt } = await createUser('testuser')
        const response = await request(app)
            .get(`/users/`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain('Forced internal server error');
    });
});

describe('PATCH /users/:id', () => {
    it('should successfully update user', async () => {
        const { jwt, result } = await createUser('testuser')
        const updateData = {
            name: 'New Name',
            email: 'newname@example.com',
            occupation: 'newOccupation',
        };

        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`])
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.userName).toEqual(result.userName);
        expect(response.body.name).toEqual(updateData.name);
        expect(response.body.occupation).toEqual(updateData.occupation);
        expect(response.body.email).toEqual(updateData.email);
        expect(response.body.password).toBeUndefined();
    });

    it('should return 401 if not authenticated', async () => {
        const { result } = await createUser('testuser')
        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=wrong`]);
        
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });
    
    it('should return 400 for invalid user ID', async () => {
        const { jwt } = await createUser('testuser')
        const invalidId = '12345';
        const response = await request(app)
            .patch(`/users/${invalidId}`)
            .set('Cookie', [`session=${jwt}`]);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ID fornecido é inválido.');
    });

    it('should return 400 for invalid name', async () => {
        const { jwt, result } = await createUser('testuser')
        const invalidData = {
            name: '123456'
        };
    
        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Nome inválido');
    });

    it('should return 400 for invalid email', async () => {
        const { jwt, result } = await createUser('testuser')
        const invalidData = {
            email: 'invalidEmail'
        };
    
        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email inválido');
    });

    it('should return 400 for invalid password', async () => {
        const { jwt, result } = await createUser('testuser')
        const invalidData = {
            password: 'abc' 
        };
    
        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`])
            .send(invalidData);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('password must be at least 5 characters');
    });

    it('should return 500 for internal server error', async () => {
        jest.spyOn(UserRepository.prototype, 'update')
            .mockImplementationOnce(() => {
                throw new Error('Forced internal server error');
            });
            const { jwt, result } = await createUser('testuser')
        const response = await request(app)
            .patch(`/users/${result._id}`)
            .set('Cookie', [`session=${jwt}`]);

        expect(response.status).toBe(500);
        expect(response.body).toContain('Forced internal server error');
    });
});

describe('DELETE /user/:userId/friend/:friendId', () => {
    it('should remove a friend successfully', async () => {
        const { jwt, result } = await createUser('testuser')
        const friend = await createUser('friend')
        await createFriendAndAccepts(result, friend.result);
        const response = await request(app)
            .delete(`/user/${result._id}/friend/${friend.result._id}`)
            .set('Cookie', `session=${jwt}`);

        const checkUser = await userModel.findById(result._id)

        expect(response.status).toBe(204);
        expect(checkUser?.friends).toEqual([]);
    });

    it('should return unauthorized if token is invalid', async () => {
        const { result } = await createUser('testuser')
        const friend = await createUser('friend')
        await createFriendAndAccepts(result, friend.result);
        const response = await request(app)
            .delete(`/user/${result._id}/friend/${friend.result._id}`)
            .set('Cookie', 'session=invalid_token');

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({"errors": "jwt malformed"});
    });

    it('should return not found if friend does not exist', async () => {
        const { jwt, result } = await createUser('testuser')
        const response = await request(app)
            .delete(`/user/${result._id}/friend/${new mongoose.Types.ObjectId()}`)
            .set('Cookie', `session=${jwt}`);

        expect(response.status).toBe(500);
        expect(response.body).toBe('Usuário não encontrado.');
    });

    it('should return bad request if user logged is different', async () => {
        const { jwt, result } = await createUser('testuser')
        const friend = await createUser('friend')
        await createFriendAndAccepts(result, friend.result);
        const response = await request(app)
            .delete(`/user/${new mongoose.Types.ObjectId()}}/friend/${friend.result._id}`)
            .set('Cookie', `session=${jwt}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Erro ao remover amizade: Você não pode remover um amigo de outra pessoa.");
    });
}) 