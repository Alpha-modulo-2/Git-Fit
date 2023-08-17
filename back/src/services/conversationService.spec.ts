import ConversationService from './conversationService';
import ConversationRepository from '../repositories/conversationRepository';
import IConversation from '../interfaces/IConversation';
import mongoose from 'mongoose';

jest.mock('../repositories/conversationRepository');

describe('ConversationService', () => {
    const mockFriendID = new mongoose.Types.ObjectId().toString()
    const mockUserId = new mongoose.Types.ObjectId().toString()
    const conversationId = new mongoose.Types.ObjectId().toString()

    const mockConversation: IConversation = {
        members: [mockFriendID, mockUserId],
        id: conversationId,
        created_at: new Date,
    };

    let conversationService: ConversationService;
    let conversationRepository: jest.Mocked<ConversationRepository>;

    beforeEach(() => {
        conversationRepository = new ConversationRepository() as jest.Mocked<ConversationRepository>;
        conversationService = new ConversationService(conversationRepository);
    });

    describe('create', () => {
        it('should create a conversation', async () => {
            conversationRepository.create.mockResolvedValue({
                error: false,
                message: "Success",
                statusCode: 201,
                // ... additional fields
            });

            const result = await conversationService.create(mockConversation);

            expect(result).toEqual({
                error: false,
                message: "Success",
                statusCode: 201,
                // ... additional fields
            });
            expect(conversationRepository.create).toHaveBeenCalledWith(mockConversation);
        });

        it('should handle error when creating a conversation', async () => {
            conversationRepository.create.mockResolvedValue({
                error: true,
                message: "Creation error",
                statusCode: 400
            });

            const result = await conversationService.create(mockConversation);

            expect(result).toEqual({
                error: true,
                message: "Creation error",
                statusCode: 400
            });
        });

        it('should handle unexpected errors during conversation creation', async () => {
            conversationRepository.create.mockRejectedValue(new Error('Unexpected error'));

            const result = await conversationService.create(mockConversation);

            expect(result).toEqual({
                error: true,
                message: "Unexpected error",
                statusCode: 500
            });
        });
    });

    describe('get', () => {
        it('should get conversations by userId', async () => {
            conversationRepository.get.mockResolvedValue({
                error: false,
                message: "Success",
                statusCode: 200,
            });

            const result = await conversationService.get(mockUserId);

            expect(result).toEqual({
                error: false,
                message: "Success",
                statusCode: 200,
            });
            expect(conversationRepository.get).toHaveBeenCalledWith(mockUserId);
        });

        it('should handle error when getting conversations', async () => {
            conversationRepository.get.mockResolvedValue({
                error: true,
                message: "Get error",
                statusCode: 400
            });

            const result = await conversationService.get(mockUserId);

            expect(result).toEqual({
                error: true,
                message: "Get error",
                statusCode: 400
            });
        });

        it('should handle unexpected errors during getting conversations', async () => {
            conversationRepository.get.mockRejectedValue(new Error('Unexpected error'));

            const result = await conversationService.get(mockUserId);

            expect(result).toEqual({
                error: true,
                message: "Unexpected error",
                statusCode: 500
            });
        });
    });
});
