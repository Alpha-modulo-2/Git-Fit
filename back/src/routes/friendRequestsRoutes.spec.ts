import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase, resetDatabase } from  '../database/mockDatabase'
import { router } from './router';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import Redis from 'ioredis';
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
    return response.body;
}

async function createUserWithFriend() {
    const requester = await createUser('requesterUser');
    const recipient = await createUser('recipientUser');
    const { token } = await createLogin('requesterUser');

    const result = await request(app)
        .post('/solicitation')
        .set('Cookie', `session=${token}`)
        .send({ requesterId: requester._id, recipientId: recipient._id });

    await request(app)
        .patch('/acceptFriend')
        .set('Cookie', `session=${token}`)
        .send({ requestId: result.body.friendRequests._id });

    return { token, requester, recipient }
}

async function createUserWithRequest() {
    const requester = await createUser('requesterUser');
    const recipient = await createUser('recipientUser');
    const { token } = await createLogin('requesterUser');

    const result = await request(app)
        .post('/solicitation')
        .set('Cookie', `session=${token}`)
        .send({ requesterId: requester._id, recipientId: recipient._id });

    const requestId = result.body.friendRequests._id

    return { token, requester, recipient, requestId }
}

describe('POST /solicitation', () => {
    it('should post a friend solicitation successfully', async () => {
        const requester = await createUser('requesterUser');
        const recipient = await createUser('recipientUser');
        const { token } = await createLogin('requesterUser');

        const response = await request(app)
            .post('/solicitation')
            .set('Cookie', `session=${token}`)
            .send({
                requesterId: requester._id,
                recipientId: recipient._id,
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Solicitação de amizade enviada com sucesso.');
        expect(response.body.friendRequests.requester).toBe(requester._id);
        expect(response.body.friendRequests.recipient).toBe(recipient._id);
    });

    it('should reject if no authentication token is provided', async () => {
        const response = await request(app).post('/solicitation');

        expect(response.status).toBe(401);
        expect(response.body.errors).toContain('jwt must be provided');
    });

    it('should reject an invalid requester ID', async () => {
        await createUser('usuarioteste');
        const recipient = await createUser('recipientUser');
        const { token } = await createLogin('usuarioteste');
        const response = await request(app)
            .post('/solicitation')
            .set('Cookie', `session=${token}`)
            .send({ requesterId: 'invalidID', recipientId: recipient._id });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ID do solicitante inválido');
    });

    it('should reject an invalid recipient ID', async () => {
        const requester = await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const response = await request(app)
            .post('/solicitation')
            .set('Cookie', `session=${token}`)
            .send({ requesterId: requester._id, recipientId: 'invalidID' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ID do solicitado inválido');
    });

    it('should reject a duplicate friend request', async () => {
        const requester = await createUser('requesterUser');
        const recipient = await createUser('recipientUser');
        const { token } = await createLogin('requesterUser');

        await request(app)
        .post('/solicitation')
        .set('Cookie', `session=${token}`)
        .send({
            requesterId: requester._id,
            recipientId: recipient._id,
        });

        const response = await request(app)
            .post('/solicitation')
            .set('Cookie', `session=${token}`)
            .send({
                requesterId: requester._id,
                recipientId: recipient._id,
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('A solicitação de amizade já existe.');
    });
    
    it('should reject a friend request if users are already friends', async () => {
        const { token, requester, recipient } = await createUserWithFriend()

        const response = await request(app)
            .post('/solicitation')
            .set('Cookie', `session=${token}`)
            .send({ requesterId: requester._id, recipientId: recipient._id });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Estes usuários já são amigos.');
    });
})

describe('GET /friendRequests/:userId', () => {
    it('should return friend requests for a valid user ID', async () => {
        const { token, requester, recipient } = await createUserWithRequest()

        const response = await request(app)
            .get(`/friendRequests/${recipient._id}`)
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.error).toBeFalsy();
        expect(response.body.statusCode).toBe(200);
        expect(response.body.friendRequests[0].requester._id).toBe(requester._id);
        expect(response.body.friendRequests[0].recipient).toBe(recipient._id);
        expect(response.body.friendRequests[0].requester.password).toBeUndefined();
        expect(response.body.friendRequests[0].requester.email).toBeUndefined();
    });

    it('should return 401 if no authentication token is provided', async () => {
        const { recipient } = await createUserWithRequest();
        const response = await request(app)
            .get(`/friendRequests/${recipient._id}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toContain('jwt must be provided');
    });

    it('should return 400 for an invalid user ID ', async () => {
        await createUser('testUser');
        const { token } = await createLogin('testUser');
        const response = await request(app)
            .get('/friendRequests/123')
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ID do user inválido');
    });

    it('should return 404 for an invalid user ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        await createUser('testUser');
        const { token } = await createLogin('testUser');
        const response = await request(app)
            .get(`/friendRequests/${nonExistentId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Nenhuma solicitação de amizade encontrada.');
    });
});

describe('PATCH /acceptFriend', () => {
    it('should successfully accept a friend request', async () => {
        const { token, requestId } = await createUserWithRequest();
    
        const response = await request(app)
            .patch('/acceptFriend')
            .set('Cookie', `session=${token}`)
            .send({ requestId });
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBeFalsy();
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Solicitação de amizade aceita com sucesso.');
    });

    it('should return an error if no authentication token is provided', async () => {
        const { requestId } = await createUserWithRequest();
        const response = await request(app)
            .patch('/acceptFriend')
            .send({ requestId });
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toContain('jwt must be provided');
    });

    it('should return an error for an invalid request ID', async () => {
        await createUser('testUser');
        const { token } = await createLogin('testUser');
    
        const response = await request(app)
            .patch('/acceptFriend')
            .set('Cookie', `session=${token}`)
            .send({ requestId: '123' });
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe('ID da solicitação inválido');
    });

    it('should return an error if the friend request is not found', async () => {
        await createUser('testUser');
        const { token } = await createLogin('testUser');
        const nonExistentId = new mongoose.Types.ObjectId();
    
        const response = await request(app)
            .patch('/acceptFriend')
            .set('Cookie', `session=${token}`)
            .send({ requestId: `${nonExistentId}` });
    
        expect(response.status).toBe(500);
        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe('Solicitação de amizade não encontrada.');
    });
})

describe('DELETE /rejectFriend/:requestId', () => {
    it('should successfully reject and delete a friend request', async () => {
        const { token, requestId } = await createUserWithRequest();
    
        const response = await request(app)
            .delete(`/rejectFriend/${requestId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBeFalsy();
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Solicitação de amizade rejeitada e excluída com sucesso.');
    });

    it('should return an error if no authentication token is provided', async () => {
        const { requestId } = await createUserWithRequest();
        const response = await request(app)
            .delete(`/rejectFriend/${requestId}`)
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toContain('jwt must be provided');
    });

    it('should return 400 if request ID is invalid', async () => {
        await createUser('testUser');
        const { token } = await createLogin('testUser');
    
        const response = await request(app)
            .delete('/rejectFriend/123')
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe('ID da solicitação inválido');
    });

    it('should return 404 if friend request is not found', async () => {
        await createUser('testUser');
        const { token } = await createLogin('testUser');
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/rejectFriend/${nonExistentId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe('Solicitação de amizade não encontrada.');
    });
})