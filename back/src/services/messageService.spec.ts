import MessageService from './messageService';
import MessageRepository from '../repositories/messageRepository';
import IMessage from '../interfaces/IMessage';
import mongoose from 'mongoose';

jest.mock('../repositories/messageRepository');

describe('MessageService', () => {
    const mockMessage: IMessage = {
        _id: new mongoose.Types.ObjectId().toString(),
        sender: new mongoose.Types.ObjectId(),
        chatId: new mongoose.Types.ObjectId(),
        text: "mockContent",
        created_at: new Date(),
    };

    const messages: IMessage[] = [mockMessage, mockMessage, mockMessage];

    let messageService: MessageService;
    let messageRepository: jest.Mocked<MessageRepository>;

    beforeEach(() => {
        messageRepository = new MessageRepository() as jest.Mocked<MessageRepository>;
        messageService = new MessageService(messageRepository);
    });

    it('should create a message', async () => {
        messageRepository.create.mockResolvedValue({ error: false, statusCode: 201, chatMessage: mockMessage });

        const result = await messageService.create(mockMessage);

        expect(result).toEqual({ error: false, statusCode: 201, chatMessage: mockMessage });
        expect(messageRepository.create).toHaveBeenCalledWith(mockMessage);
    });

    it('should get messages', async () => {
        messageRepository.get.mockResolvedValue({ error: false, statusCode: 200, chatMessage: messages });

        const result = await messageService.get(mockMessage.chatId.toString());

        expect(result).toEqual({ error: false, statusCode: 200, chatMessage: messages });
        expect(messageRepository.get).toHaveBeenCalledWith(mockMessage.chatId.toString());
    });

    it('should handle error when creating a message', async () => {
        messageRepository.create.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await messageService.create(mockMessage);

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(messageRepository.create).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle error when getting messages', async () => {
        messageRepository.get.mockRejectedValue({ error: true, message: 'Server error', statusCode: 500 });

        const result = await messageService.get(mockMessage.chatId.toString());

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
        expect(messageRepository.get).toHaveBeenCalledWith(mockMessage.chatId.toString());
    });

    it('should handle message not found when creating', async () => {
        messageRepository.create.mockResolvedValue({ error: true, message: 'message not found', statusCode: 404 });

        const result = await messageService.create(mockMessage);

        expect(result).toEqual({ error: true, message: 'message not found', statusCode: 404 });
        expect(messageRepository.create).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle message not found when getting', async () => {
        messageRepository.get.mockResolvedValue({ error: true, message: 'message not found', statusCode: 404 });

        const result = await messageService.get(mockMessage.chatId.toString());

        expect(result).toEqual({ error: true, message: 'message not found', statusCode: 404 });
        expect(messageRepository.get).toHaveBeenCalledWith(mockMessage.chatId.toString());
    });
});