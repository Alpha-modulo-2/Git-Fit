import { userModel } from "../models/user";
import { friendRequestsModel } from "../models/friendRequests";
import FriendRequestsRepository from "./FriendRequestsRepository";

let friendRequestsRepository: FriendRequestsRepository;
const requesterId = "999456789101112131415160";
const recipientId = "999456789101112131415161";
const userId = "999456789101112131415163";
const requestId = "999456789101112131415164";

const mockRequester = {
    _id: requesterId,
    friends: [],
};

const mockRecipient = {
    _id: recipientId,
    friends: [],
};

const mockFriendRequests = [{
    requester: {
        _id: userId,
        username: "sampleUser",
        friends: [],
    }
}];

beforeEach(() => {
    friendRequestsRepository = new FriendRequestsRepository();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe ("FriendRequestsRepository", () => {
    describe('insert', () => {
        it('should successfully insert a friend request', async () => {
            friendRequestsModel.findOne = jest.fn().mockResolvedValue(null);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(mockRequester)
                .mockResolvedValueOnce(mockRecipient);
            friendRequestsModel.create = jest.fn().mockResolvedValue({
                requester: requesterId,
                recipient: recipientId
            });

            const result = await friendRequestsRepository.insert(requesterId, recipientId);

            expect(friendRequestsModel.findOne).toHaveBeenCalledWith({
                requester: requesterId,
                recipient: recipientId
            });
            expect(userModel.findById).toHaveBeenCalledWith(requesterId);
            expect(userModel.findById).toHaveBeenCalledWith(recipientId);
            expect(friendRequestsModel.create).toHaveBeenCalledWith({
                requester: requesterId,
                recipient: recipientId
            });
            expect(result.error).toEqual(false);
            expect(result.statusCode).toEqual(201);
            expect(result.message).toEqual("Solicitação de amizade enviada com sucesso.");
        });

        it('should throw error if friend request already exists', async () => {
            friendRequestsModel.findOne = jest.fn().mockResolvedValue({
                requester: requesterId,
                recipient: recipientId
            });

            const result = await friendRequestsRepository.insert(requesterId, recipientId);

            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(409);
            expect(result.message).toEqual("A solicitação de amizade já existe.");
        });

        it('should throw error if user is not found', async () => {
            friendRequestsModel.findOne = jest.fn().mockResolvedValue(null);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            const result = await friendRequestsRepository.insert(requesterId, recipientId);

            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(404);
            expect(result.message).toEqual("Usuário não encontrado.");
        });

        it('should throw error if users are already friends', async () => {
            const mockRequesterWithFriend = {
                ...mockRequester,
                friends: [recipientId],
            };

            const mockRecipientWithFriend = {
                ...mockRecipient,
                friends: [requesterId],
            };

            friendRequestsModel.findOne = jest.fn().mockResolvedValue(null);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(mockRequesterWithFriend)
                .mockResolvedValueOnce(mockRecipientWithFriend);

            const result = await friendRequestsRepository.insert(requesterId, recipientId);

            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(404);
            expect(result.message).toEqual("Estes usuários já são amigos.");
        });

        it('should handle generic error', async () => {
            friendRequestsModel.findOne = jest.fn().mockRejectedValue(new Error("Some error"));

            const result = await friendRequestsRepository.insert(requesterId, recipientId);

            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(500);
            expect(result.message).toEqual("Some error");
        });
    });

    describe('friendRequestsByUser', () => {
        it('should successfully retrieve friend requests for a user', async () => {
            friendRequestsModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockFriendRequests)
            });
    
            const result = await friendRequestsRepository.friendRequestsByUser(userId);
    
            expect(friendRequestsModel.find).toHaveBeenCalledWith({
                recipient: userId
            });

            expect(result.error).toEqual(false);
            expect(result.statusCode).toEqual(200);
            expect(result.friendRequests).toEqual(mockFriendRequests);
        });

        it('should throw an error if no friend requests are found', async () => {
            friendRequestsModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue([])
            });
    
            const response = await friendRequestsRepository.friendRequestsByUser(userId);
    
            expect(friendRequestsModel.find).toHaveBeenCalledWith({
                recipient: userId
            });
            expect(response.error).toEqual(true);
            expect(response.statusCode).toEqual(404);
            expect(response.message).toEqual("Nenhuma solicitação de amizade encontrada.");
        });
    })

    describe('acceptFriend', () => {
        it('should accept the friend request successfully', async () => {
            friendRequestsModel.findById = jest.fn().mockResolvedValue(mockFriendRequests);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(mockRequester)
                .mockResolvedValueOnce(mockRecipient);
            userModel.findByIdAndUpdate = jest.fn();
            friendRequestsModel.findByIdAndDelete = jest.fn();
    
            const result = await friendRequestsRepository.acceptFriend(requestId);
    
            expect(result.error).toEqual(false);
            expect(result.statusCode).toEqual(200);
            expect(result.message).toEqual("Solicitação de amizade aceita com sucesso.");
        });

        it('should throw an error if friend request is not found', async () => {
            friendRequestsModel.findById = jest.fn().mockResolvedValue(null);
    
            const result = await friendRequestsRepository.acceptFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(500);
            expect(result.message).toEqual("Solicitação de amizade não encontrada.");
        });

        it('should throw an error if one of the users is not found', async () => {
            friendRequestsModel.findById = jest.fn().mockResolvedValue(mockFriendRequests);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockRecipient);
    
            const result = await friendRequestsRepository.acceptFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(404);
            expect(result.message).toEqual("Usuário não encontrado.");
        });

        it('should throw an error if users are already friends', async () => {
            const mockRequesterWithFriend = {
                ...mockRequester,
                friends: [mockRecipient._id],
            };
    
            friendRequestsModel.findById = jest.fn().mockResolvedValue(mockFriendRequests);
            userModel.findById = jest.fn()
                .mockResolvedValueOnce(mockRequesterWithFriend)
                .mockResolvedValueOnce(mockRecipient);
    
            const result = await friendRequestsRepository.acceptFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(400);
            expect(result.message).toEqual("Este usuário já é seu amigo.");
        });

        it('should handle generic error', async () => {
            friendRequestsModel.findById = jest.fn().mockRejectedValue(new Error("Some error"));
    
            const result = await friendRequestsRepository.acceptFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(500);
            expect(result.message).toEqual("Some error");
        });
    })

    describe('rejectFriend', () => {
        it('should reject the friend request successfully', async () => {
            friendRequestsModel.findById = jest.fn().mockResolvedValue(mockFriendRequests);
            friendRequestsModel.findByIdAndDelete = jest.fn();
    
            const result = await friendRequestsRepository.rejectFriend(requestId);
    
            expect(result.error).toEqual(false);
            expect(result.statusCode).toEqual(200);
            expect(result.message).toEqual("Solicitação de amizade rejeitada e excluída com sucesso.");
        });

        it('should throw an error if friend request is not found', async () => {
            friendRequestsModel.findById = jest.fn().mockResolvedValue(null);
    
            const result = await friendRequestsRepository.rejectFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(404);
            expect(result.message).toEqual("Solicitação de amizade não encontrada.");
        });

        it('should handle generic error', async () => {
            friendRequestsModel.findById = jest.fn().mockRejectedValue(new Error("Some error"));
    
            const result = await friendRequestsRepository.rejectFriend(requestId);
    
            expect(result.error).toEqual(true);
            expect(result.statusCode).toEqual(500);
            expect(result.message).toEqual("Some error");
        });
    })
})