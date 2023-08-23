import MessageRepository from './messageRepository';
import { messageModel } from '../models/message';
import mongoose from 'mongoose';
import IMessage from '../interfaces/IMessage';

describe('MessageRepository', () => {
    const mockChatId = '12345';
    const mockMessage: IMessage = {
        _id: new mongoose.Types.ObjectId().toString(),
        sender: new mongoose.Types.ObjectId(),
        chatId: new mongoose.Types.ObjectId(),
        text: "mockContent",
        created_at: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully create a message', async () => {
        messageModel.create = jest.fn().mockResolvedValue(mockMessage);

        const messageRepository = new MessageRepository();
        const result = await messageRepository.create(mockMessage);

        expect(messageModel.create).toHaveBeenCalledWith(mockMessage);
        expect(result).toEqual({
            error: false,
            statusCode: 201,
            chatMessage: mockMessage
        });
    });

    it('should handle failure when creating a message', async () => {
        messageModel.create = jest.fn().mockResolvedValue(null);

        const messageRepository = new MessageRepository();
        const result = await messageRepository.create(mockMessage);

        expect(result).toEqual({
            error: true,
            message: "Mensagem não Criada.",
            statusCode: 404,
        });
    });

    it('should handle exceptions when creating a message', async () => {
        messageModel.create = jest.fn().mockRejectedValue(new Error('Database error'));

        const messageRepository = new MessageRepository();
        const result = await messageRepository.create(mockMessage);

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            statusCode: 500,
        });
    });

    it('should retrieve messages by chatId', async () => {
        const mockFind = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis()
        };
        messageModel.find = jest.fn().mockReturnValue(mockFind);
        mockFind.limit.mockResolvedValue([mockMessage, mockMessage]);

        const messageRepository = new MessageRepository();
        const result = await messageRepository.get(mockChatId);

        expect(messageModel.find).toHaveBeenCalledWith({ chatId: mockChatId });
        expect(result).toEqual({
            error: false,
            statusCode: 200,
            chatMessage: [mockMessage, mockMessage]
        });
    });

    it('should handle exceptions when retrieving messages', async () => {
        const mockFind = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockImplementation(() => { throw new Error('Server error') })
        };

        messageModel.find = jest.fn().mockReturnValue(mockFind);

        const messageRepository = new MessageRepository();
        const result = await messageRepository.get(mockChatId);

        expect(result).toEqual({
            error: true,
            message: 'Server error',
            statusCode: 500,
        });
    });
});