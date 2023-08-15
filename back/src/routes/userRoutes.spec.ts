import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase } from  '../database/mockDatabase'
import { router } from './router';
import UserRepository from '../repositories/UserRepository';
const cookieParser = require('cookie-parser');

jest.mock('../middleware/cacheMiddleware', () => {
    return (req: any, res: any, next: any) => next();
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

beforeAll(async () => {
    await connectToTestDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

async function createLogin() {
    const response = await request(app)
    .post('/login')
    .send({
        userName: 'testuser',
        password: 'test12345'
    })
    return response.body; 
}

describe('Integration tests with authentication', () => {
    describe('POST /users/', () => {
        it('should successfully create a new user', async () => {
            const user = {
                name: 'Test User',
                userName: 'testuser',
                password: 'test12345',
                email: 'testuser@example.com',
                created_at: new Date(),
                updated_at: new Date(),
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
            expect(response.body).toHaveProperty('id');
            expect(response.body.userName).toBe('testuser');
        });
    
        it('should fail when name is invalid', async () => {
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
    
        it('should fail when email is invalid', async () => {
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
    
        it('should fail when password is too short', async () => {
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
    
        it('should fail when age is negative', async () => {
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
    
        it('should fail when userName is already taken', async () => {
            const user = {
                name: 'Test User',
                userName: 'testuser',
                password: 'test12345',
                email: 'testuser@example.com',
            };
    
            await request(app).post('/users').send(user);
    
            const response = await request(app).post('/users').send(user); // tentar inserir novamente
    
            expect(response.status).toBe(500);
            expect(response.body).toBe("Username já esta sendo utilizado");
        });
    
        it('should fail on generic error', async () => {
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
            const name = 'Test User'; 
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/search?name=${name}`)
                .set('Cookie', [`session=${login.token}`]);
    
            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('userName');
            expect(response.body[0].name).toContain(name);
        });

        it('should return 401 if not authenticated', async () => {
            const response = await request(app)
                .get(`/users/search`)
                .set('Cookie', [`session=wrong`]);
            
            expect(response.status).toBe(401);
            expect(response.body).toMatchObject({"errors": "jwt malformed"});
        });

        it('should return 400 if no name is provided in the query', async () => {
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/search`)
                .set('Cookie', [`session=${login.token}`]);
            
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: true, message: "O nome é obrigatório" });
        });

        it('should return 404 if the user is not found', async () => {
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/search?name=${'NoSuchUser'}`)
                .set('Cookie', [`session=${login.token}`]);
            
            expect(response.status).toBe(404);
            expect(response.body).toContain("Usuário não encontrado.");
        });

        it('should return 500 for internal server error', async () => {
            UserRepository.prototype.getByName = jest.fn(() => {
                throw new Error('Forced error');
            });
            const name = 'Test User';
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/search?name=${name}`)
                .set('Cookie', [`session=${login.token}`]);
            
            expect(response.status).toBe(500);
            expect(response.body).toContain("Forced error");
        });
    });

    describe('GET /users/:id', () => {
        it('should successfully return a user by ID', async () => {
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/${login.user._id}`)
                .set('Cookie', [`session=${login.token}`]);
    
            expect(response.status).toBe(200);
            expect(response.body.userName).toEqual(login.user.userName.toString());; 
            expect(response.body._id).toEqual(login.user._id.toString());
        });

        it('should return 401 if not authenticated', async () => {
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/${login.user._id}`)
                .set('Cookie', [`session=wrong`]);
            
            expect(response.status).toBe(401);
            expect(response.body).toMatchObject({"errors": "jwt malformed"});
        });

        it('should return 400 for invalid ID format', async () => {
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/invalidIDformat`)
                .set('Cookie', [`session=${login.token}`]);
    
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: true, message: "ID fornecido é inválido." });
        });

        it('should return 500 for internal server error', async () => {
            UserRepository.prototype.getOne = jest.fn(() => {
                throw new Error('Forced error');
            });
            
            const login = await createLogin();
            const response = await request(app)
                .get(`/users/614a25f7e3a77c9f7f5e2488`)
                .set('Cookie', [`session=${login.token}`]);
    
            expect(response.status).toBe(500);
            expect(response.body).toContain("Forced error");
        });
    });
});