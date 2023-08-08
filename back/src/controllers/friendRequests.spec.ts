import { Request, Response } from 'express';
import FriendRequestsController from './FriendRequestsController';
import FriendRequestsService from '../services/FriendRequestsService';

interface MockfriendRequestsService extends FriendRequestsService {
    insert: jest.Mock;
    acceptFriend: jest.Mock;
    friendRequestsByUser: jest.Mock;
    rejectFriend: jest.Mock;
}

const INVALID_REQUESTER_ID_MESSAGE = "ID do solicitante inválido";
const INVALID_RECIPIENT_ID_MESSAGE = "ID do solicitado inválido";

describe('friendRequestsController', () => {
    let req: any, res: any;
    let friendRequestsController: FriendRequestsController;
    let friendRequestsService: MockfriendRequestsService;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            json: jest.fn(() => res),
            status:jest.fn(() => res),
        };

        friendRequestsService = {
            insert: jest.fn(), 
            acceptFriend: jest.fn(),
            friendRequestsByUser: jest.fn(),
            rejectFriend: jest.fn(),
        } as MockfriendRequestsService;

        friendRequestsController = new FriendRequestsController(friendRequestsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('should insert successfully', async () => {
            const result = { error: false, statusCode: 201, data: 'Solicitação de amizade enviada com sucesso.' };
            req.body = { requesterId: '60edeb8b9f1b7c3dd1e8772d', recipientId: '60edeb8b9f1b7c3dd1e8772e' };

            friendRequestsService.insert.mockResolvedValue(result);

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).toHaveBeenCalledWith(req.body.requesterId, req.body.recipientId);
            expect(res.status).toHaveBeenCalledWith(result.statusCode);
            expect(res.json).toHaveBeenCalledWith(result);
        });

        it('should return error if requesterId is not provided', async () => {
            req.body = { recipientId: '60edeb8b9f1b7c3dd1e8772d' };

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_REQUESTER_ID_MESSAGE
            });
        });

        it('should return error if recipientId is not provided', async () => {
            req.body = { requesterId: '60edeb8b9f1b7c3dd1e8772d' };

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_RECIPIENT_ID_MESSAGE
            });
        });

        it('should return error if requesterId is not a valid ObjectId', async () => {
            req.body = { requesterId: 'invalidId', recipientId: '60edeb8b9f1b7c3dd1e8772d' };

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_REQUESTER_ID_MESSAGE,
            });
        });

        it('should return error if recipientId is not a valid ObjectId', async () => {
            req.body = { requesterId: '60edeb8b9f1b7c3dd1e8772d', recipientId: 'invalidId' };

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_RECIPIENT_ID_MESSAGE,
            });
        });

        it('should return error if service throws', async () => {
            req.body = { requesterId: '60edeb8b9f1b7c3dd1e8772d', recipientId: '60edeb8b9f1b7c3dd1e8772e' };

            friendRequestsService.insert.mockRejectedValue(new Error("Test error"));

            await friendRequestsController.insert(req as Request, res as Response);

            expect(friendRequestsService.insert).toHaveBeenCalledWith(req.body.requesterId, req.body.recipientId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: "Test error",
            });
        });
    });

    describe('friendRequestsByUser', () => {
        it('should retrieve friend requests successfully', async () => {
            const result = { error: false, statusCode: 200, data: ['request1', 'request2'] };
            req.params = { userId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.friendRequestsByUser.mockResolvedValue(result);
    
            await friendRequestsController.friendRequestsByUser(req as Request, res as Response);
    
            expect(friendRequestsService.friendRequestsByUser).toHaveBeenCalledWith(req.params.userId);
            expect(res.status).toHaveBeenCalledWith(result.statusCode);
            expect(res.json).toHaveBeenCalledWith(result);
        });
    
        it('should return error if userId is not provided', async () => {
            req.params = {};
    
            await friendRequestsController.friendRequestsByUser(req as Request, res as Response);
    
            expect(friendRequestsService.friendRequestsByUser).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do user inválido"
            });
        });
    
        it('should return error if userId is not a valid ObjectId', async () => {
            req.params = { userId: 'invalidId' };
    
            await friendRequestsController.friendRequestsByUser(req as Request, res as Response);
    
            expect(friendRequestsService.friendRequestsByUser).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do user inválido"
            });
        });
    
        it('should return error if service throws', async () => {
            req.params = { userId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.friendRequestsByUser.mockRejectedValue(new Error("Test error"));
    
            await friendRequestsController.friendRequestsByUser(req as Request, res as Response);
    
            expect(friendRequestsService.friendRequestsByUser).toHaveBeenCalledWith(req.params.userId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: "Test error"
            });
        });
    })

    describe('acceptFriend', () => {
        it('should accept friend request successfully', async () => {
            const result = { error: false, statusCode: 200, data: "Solicitação de amizade aceita com sucesso." };
            req.body = { requestId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.acceptFriend.mockResolvedValue(result);
    
            await friendRequestsController.acceptFriend(req as Request, res as Response);
    
            expect(friendRequestsService.acceptFriend).toHaveBeenCalledWith(req.body.requestId);
            expect(res.status).toHaveBeenCalledWith(result.statusCode);
            expect(res.json).toHaveBeenCalledWith(result);
        });
    
        it('should return error if requestId is not provided', async () => {
            req.body = {};
    
            await friendRequestsController.acceptFriend(req as Request, res as Response);
    
            expect(friendRequestsService.acceptFriend).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        });
    
        it('should return error if requestId is not a valid ObjectId', async () => {
            req.body = { requestId: 'invalidId' };
    
            await friendRequestsController.acceptFriend(req as Request, res as Response);
    
            expect(friendRequestsService.acceptFriend).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        });
    
        it('should return error if service throws', async () => {
            req.body = { requestId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.acceptFriend.mockRejectedValue(new Error("Test error"));
    
            await friendRequestsController.acceptFriend(req as Request, res as Response);
    
            expect(friendRequestsService.acceptFriend).toHaveBeenCalledWith(req.body.requestId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: "Test error"
            });
        });
    })

    describe('rejectFriend', () => {
        it('should reject friend request successfully', async () => {
            const result = { error: false, statusCode: 200, data: "Solicitação de amizade rejeitada e excluída com sucesso." };
            req.params = { requestId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.rejectFriend.mockResolvedValue(result);
    
            await friendRequestsController.rejectFriend(req as Request, res as Response);
    
            expect(friendRequestsService.rejectFriend).toHaveBeenCalledWith(req.params.requestId);
            expect(res.status).toHaveBeenCalledWith(result.statusCode);
            expect(res.json).toHaveBeenCalledWith(result);
        });
    
        it('should return error if requestId is not provided', async () => {
            req.params = {};
    
            await friendRequestsController.rejectFriend(req as Request, res as Response);
    
            expect(friendRequestsService.rejectFriend).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        });
    
        it('should return error if requestId is not a valid ObjectId', async () => {
            req.params = { requestId: 'invalidId' };
    
            await friendRequestsController.rejectFriend(req as Request, res as Response);
    
            expect(friendRequestsService.rejectFriend).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da solicitação inválido"
            });
        });
    
        it('should return error if service throws', async () => {
            req.params = { requestId: '60edeb8b9f1b7c3dd1e8772d' };
    
            friendRequestsService.rejectFriend.mockRejectedValue(new Error("Test error"));
    
            await friendRequestsController.rejectFriend(req as Request, res as Response);
    
            expect(friendRequestsService.rejectFriend).toHaveBeenCalledWith(req.params.requestId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: "Test error"
            });
        });
    })
});