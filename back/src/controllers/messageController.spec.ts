import { Request, Response } from 'express';
import MessageController from './messageController';
import MessageService from '../services/messageService';

// Define a mock for the MessageService
interface MockMessageService extends MessageService {
    create: jest.Mock;
    get: jest.Mock;
}

describe('MessageController', () => {
    let req: any, res: any;
    let messageController: any;
    let messageService: MockMessageService;

    const mockChatId = 'mockChatId';
    const mockSenderId = 'mockSenderId';
    const mockText = 'Hello World';

    const mockChatMessage = {
        chatId: mockChatId,
        sender: mockSenderId,
        text: mockText
    };

    beforeEach(() => {
        req = {
            body: { ...mockChatMessage },
            params: { chatId: mockChatId }
        };
        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };

        messageService = {
            create: jest.fn(),
            get: jest.fn(),
        } as MockMessageService;

        messageController = new MessageController(messageService);
    });

    it('should create a message', async () => {
        messageService.create.mockResolvedValue({ statusCode: 200, chatMessage: mockChatMessage });

        await messageController.create(req, res);

        expect(messageService.create).toHaveBeenCalledWith(mockChatMessage);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockChatMessage);
    });

    it('should return error if MessageService.create throws', async () => {
        const error = new Error('Creation error');
        messageService.create.mockRejectedValue(error);

        await messageController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao criar a mensagem ${error.message}`
        });
    });

    it('should get a message', async () => {
        messageService.get.mockResolvedValue({ statusCode: 200, chatMessage: mockChatMessage });

        await messageController.get(req, res);

        expect(messageService.get).toHaveBeenCalledWith(mockChatId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockChatMessage);
    });

    it('should return error if MessageService.get throws', async () => {
        const error = new Error('Fetch error');
        messageService.get.mockRejectedValue(error);

        await messageController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao buscar as mensagens: ${error.message}`
        });
    });
});