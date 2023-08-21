import ConversationRepository from './conversationRepository';
import { conversationModel } from '../models/conversation';
import { messageModel } from '../models/message';

describe('ConversationRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUserId = '123456789012345678901234';
    const mockConversation = {
        members: [mockUserId, '456']
    };
    const mockExistingConversation = {
        ...mockConversation,
        _id: '123456789012345678901789',
        otherData: 'test'
    };

    it('should create a new conversation', async () => {
        conversationModel.findOne = jest.fn().mockResolvedValue(null);
        conversationModel.create = jest.fn().mockResolvedValue(mockExistingConversation);

        const conversationRepository = new ConversationRepository();
        const result = await conversationRepository.create(mockConversation);

        expect(conversationModel.findOne).toHaveBeenCalledWith({ members: { $all: mockConversation.members } });
        expect(conversationModel.create).toHaveBeenCalledWith(mockConversation);
        expect(result).toEqual({ error: false, statusCode: 201, conversation: mockExistingConversation });
    });

    it('should throw an error if the conversation already exists', async () => {
        conversationModel.findOne = jest.fn().mockResolvedValue(mockExistingConversation);

        const conversationRepository = new ConversationRepository();
        const result = await conversationRepository.create(mockConversation);

        expect(conversationModel.findOne).toHaveBeenCalledWith({ members: { $all: mockConversation.members } });
        expect(result).toEqual({ error: true, message: "Conversa já existe.", statusCode: 403 });
    });

    it('should throw an error if conversation creation fails', async () => {
        conversationModel.findOne = jest.fn().mockResolvedValue(null);
        conversationModel.create = jest.fn().mockResolvedValue(null);

        const conversationRepository = new ConversationRepository();
        const result = await conversationRepository.create(mockConversation);

        expect(conversationModel.findOne).toHaveBeenCalledWith({ members: { $all: mockConversation.members } });
        expect(result).toEqual({ error: true, message: "Conversa não Criada.", statusCode: 404 });
    });

    it('should get all conversations for a user', async () => {
        const mockConversations = [mockExistingConversation, mockExistingConversation];
        const mockPopulatedResults = mockConversations.map(conversation => ({
            ...conversation,
            toJSON: jest.fn().mockReturnValue(conversation)
        }));

        conversationModel.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockPopulatedResults)
        });

        // Mock the countDocuments function to always return a fixed number (e.g., 5 unread messages)
        const mockUnreadCount = 5;
        messageModel.countDocuments = jest.fn().mockResolvedValue(mockUnreadCount);

        const conversationRepository = new ConversationRepository();
        const result = await conversationRepository.get(mockUserId);

        // Create the expected response, each conversation with a mockUnreadCount of 5
        const expectedConversations = mockConversations.map(conversation => ({
            ...conversation,
            unreadCount: mockUnreadCount
        }));

        expect(conversationModel.find).toHaveBeenCalledWith({ members: { $in: mockUserId } });
        expect(result).toEqual({ error: false, statusCode: 200, conversation: expectedConversations });

    });

    it('should handle server errors when fetching conversations', async () => {
        conversationModel.find = jest.fn().mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const conversationRepository = new ConversationRepository();
        const result = await conversationRepository.get(mockUserId);

        expect(result).toEqual({ error: true, message: 'Server error', statusCode: 500 });
    });

});