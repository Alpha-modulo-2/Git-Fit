import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase, resetDatabase } from '../database/mockDatabase'
import { router } from './router';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { summaryCronJob } from '../repositories/userSummaryRepository';
import { cardCronJob } from '../repositories/CardRepository';
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
    summaryCronJob.stop()
    cardCronJob.stop()
});

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
    return response.body;
}

describe('POST /login', () => {
    it('should login with valid credentials', async () => {
        await createUser('testuser')
        const credentials = {
            userName: 'testuser',
            password: 'test12345'
        };

        const response = await request(app)
            .post('/login')
            .send(credentials);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Usuário '${credentials.userName}' logado com sucesso.`);
        expect(response.body.user.userName).toBe(credentials.userName);
        expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
        await createUser('testuser')
        const credentials = {
            userName: 'testuser',
            password: 'wrongPassword'
        };

        const response = await request(app)
            .post('/login')
            .send(credentials);

        expect(response.status).toBe(401);
        expect(response.body).toBe('Usuário ou senha incorretos.');
    });

    it('should require both username and password', async () => {
        let response = await request(app).post('/login').send({
            userName: '',
            password: 'testPassword'
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('O username é obrigatório');

        response = await request(app).post('/login').send({
            userName: 'testUser',
            password: ''
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Senha inválida');
    });

    it('should handle JWTSECRET not defined', async () => {
        process.env.JWTSECRET = '';

        const credentials = {
            userName: 'testUser',
            password: 'testPassword'
        };

        const response = await request(app)
            .post('/login')
            .send(credentials);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('JWTSECRET nao definido');
    });
})