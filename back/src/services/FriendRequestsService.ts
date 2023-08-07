import IResult from "../interfaces/IResult";
import FriendRequestsRepository from "../repositories/FriendRequestsRepository";

export default class FriendRequestsService {
    private repository: FriendRequestsRepository;

    constructor(repository: FriendRequestsRepository = new FriendRequestsRepository()) {
        this.repository = repository;
    }

    async insert(requesterId: string, recipientId: string): Promise<IResult> {
        const result = await this.repository.insert(requesterId, recipientId);
    
        return result;
    }

    async friendRequestsByUser(userId: string): Promise<IResult> {
        const result = await this.repository.friendRequestsByUser(userId);

        return result;
    }

    async acceptFriend(requestId: string): Promise<IResult> {
        const result = await this.repository.acceptFriend(requestId);

        return result;
    }
    
    async rejectFriend(requestId: string): Promise<IResult> {
        const result = await this.repository.rejectFriend(requestId);

        return result
    }
}