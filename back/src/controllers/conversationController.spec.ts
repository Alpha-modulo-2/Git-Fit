import ConversationController from './conversationController';
import ConversationService from '../services/conversationService';
import { Request, Response } from 'express';

interface MockConversationService extends ConversationService {
    create: jest.Mock;
    get: jest.Mock;
}

describe('ConversationController', () => {

    let req: any, res: any, next: any;
    let conversationController: ConversationController;
    let conversationService: MockConversationService;

    const mockUserId = "123";
    const mockFriendId = "456";

    const mockConversation = {
        id: "789",
        members: [mockUserId, mockFriendId]
    };

    beforeEach(() => {
        req = {
            body: {
                userId: mockUserId,
                friendId: mockFriendId
            },
            params: {
                userId: mockUserId
            }
        }

        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        } as unknown as Response;

        conversationService = {
            create: jest.fn(),
            get: jest.fn(),
        } as MockConversationService;

        conversationController = new ConversationController(conversationService);
    });

    it('should create a conversation', async () => {
        conversationService.create.mockResolvedValue({ error: false, statusCode: 200, user: mockConversation });

        await conversationController.create(req, res);

        expect(conversationService.create).toHaveBeenCalledWith({ members: [mockUserId, mockFriendId] });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConversation);
    });

    it('should get a conversation by user ID', async () => {
        conversationService.get.mockResolvedValue({ error: false, statusCode: 200, conversation: mockConversation });

        await conversationController.get(req, res);

        expect(conversationService.get).toHaveBeenCalledWith(mockUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConversation);
    });

    it('should handle error while creating a conversation', async () => {
        const error = new Error('Creation error');
        conversationService.create.mockRejectedValue(error);

        await conversationController.create(req, res);

        expect(conversationService.create).toHaveBeenCalledWith({ members: [mockUserId, mockFriendId] });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `Erro ao criar a conversa ${error.message}`, statusCode: 500 });
    });

    it('should handle error while getting a conversation', async () => {
        const error = new Error('Fetching error');
        conversationService.get.mockRejectedValue(error);

        await conversationController.get(req, res);

        expect(conversationService.get).toHaveBeenCalledWith(mockUserId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: true, message: `Erro ao buscar a conversa: ${error.message}`, statusCode: 500 });
    });
});
