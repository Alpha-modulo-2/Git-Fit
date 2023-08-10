import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase } from  '../database/mockDatabase'
import { router } from './router';
import UserRepository from '../repositories/UserRepository';

const app = express();
app.use(bodyParser.json());
app.use('/', router);

describe('POST /users/', () => {
    beforeAll(async () => {
        await connectToTestDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await closeDatabase();
    });

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