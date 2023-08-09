import FriendRequestsService from "./FriendRequestsService";
import FriendRequestsRepository from "../repositories/FriendRequestsRepository";

interface MockFriendRequestsRepository extends FriendRequestsRepository {
    insert: jest.Mock;
    acceptFriend: jest.Mock;
    friendRequestsByUser: jest.Mock;
    rejectFriend: jest.Mock;
}

const requesterId = '605cde4f1f29239b6a8d7f70';
const recipientId = '605cde4f1f29239b6a8d7f60';
const userId = "123456789101112131415161";
const requestId = "123456789101112131415160";

describe('FriendRequestsService', () => {
    let friendRequestsService: FriendRequestsService;
    let friendRequestsRepository: MockFriendRequestsRepository;

    beforeEach(() => {
        friendRequestsRepository = {
            hasCards: jest.fn(),
            insert: jest.fn(),
            acceptFriend: jest.fn(),
            friendRequestsByUser: jest.fn(),
            rejectFriend: jest.fn(),
        } as MockFriendRequestsRepository;

        friendRequestsService = new FriendRequestsService(friendRequestsRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('should insert a friend request successfully', async () => {
            const mockResult = { 
                error: false, 
                statusCode: 201, 
                message: `Solicitação de amizade enviada com sucesso.`,
                data: { requesterId, recipientId }
            };
            
            friendRequestsRepository.insert.mockResolvedValue(mockResult);
    
            const result = await friendRequestsService.insert(requesterId, recipientId);
    
            expect(friendRequestsRepository.insert).toHaveBeenCalledWith(requesterId, recipientId);
            expect(result).toEqual(mockResult);
        });
    
        it('should return a server error if insertion fails', async () => {
            const mockErrorResult = { 
                error: true, 
                statusCode: 500, 
                message: "Erro interno do servidor."
            };
            
            friendRequestsRepository.insert.mockRejectedValue(new Error("Test error"));
    
            const result = await friendRequestsService.insert(requesterId, recipientId);
    
            expect(friendRequestsRepository.insert).toHaveBeenCalledWith(requesterId, recipientId);
            expect(result).toEqual(mockErrorResult);
        });
    });

    describe('friendRequestsByUser', () => {
        it('should retrieve friend requests by user successfully', async () => {
            const mockResult = { 
                error: false, 
                statusCode: 200, 
                data: ['Request1', 'Request2', 'Request3'] 
            };
            
            friendRequestsRepository.friendRequestsByUser.mockResolvedValue(mockResult);
    
            const result = await friendRequestsService.friendRequestsByUser(userId);
    
            expect(friendRequestsRepository.friendRequestsByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockResult);
        });
    
        it('should return a server error if retrieval fails', async () => {
            const mockErrorResult = { 
                error: true, 
                statusCode: 500, 
                message: "Erro interno do servidor."
            };
            
            friendRequestsRepository.friendRequestsByUser.mockRejectedValue(new Error("Test error"));
    
            const result = await friendRequestsService.friendRequestsByUser(userId);
    
            expect(friendRequestsRepository.friendRequestsByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockErrorResult);
        });
    });

    describe('acceptFriend', () => {
        it('should accept a friend request successfully', async () => {
            const mockResult = { 
                error: false, 
                statusCode: 200, 
                message: "Solicitação de amizade aceita com sucesso." 
            };
            
            friendRequestsRepository.acceptFriend.mockResolvedValue(mockResult);
    
            const result = await friendRequestsService.acceptFriend(requestId);
    
            expect(friendRequestsRepository.acceptFriend).toHaveBeenCalledWith(requestId);
            expect(result).toEqual(mockResult);
        });
    
        it('should return a server error if accept operation fails', async () => {
            const mockErrorResult = { 
                error: true, 
                statusCode: 500, 
                message: "Erro interno do servidor."
            };
            
            friendRequestsRepository.acceptFriend.mockRejectedValue(new Error("Test error"));
    
            const result = await friendRequestsService.acceptFriend(requestId);
    
            expect(friendRequestsRepository.acceptFriend).toHaveBeenCalledWith(requestId);
            expect(result).toEqual(mockErrorResult);
        });
    });

    describe('rejectFriend', () => {
        it('should reject a friend request successfully', async () => {
            const mockResult = { 
                error: false, 
                statusCode: 200, 
                message: "Solicitação de amizade rejeitada com sucesso." 
            };
            
            friendRequestsRepository.rejectFriend.mockResolvedValue(mockResult);
    
            const result = await friendRequestsService.rejectFriend(requestId);
    
            expect(friendRequestsRepository.rejectFriend).toHaveBeenCalledWith(requestId);
            expect(result).toEqual(mockResult);
        });
    
        it('should return a server error if reject operation fails', async () => {
            const mockErrorResult = { 
                error: true, 
                statusCode: 500, 
                message: "Erro interno do servidor."
            };
            
            friendRequestsRepository.rejectFriend.mockRejectedValue(new Error("Test error"));
    
            const result = await friendRequestsService.rejectFriend(requestId);
    
            expect(friendRequestsRepository.rejectFriend).toHaveBeenCalledWith(requestId);
            expect(result).toEqual(mockErrorResult);
        });
    });
})