import IFriendsRequests from "../interfaces/IFriendRequests";
import IResult from "../interfaces/IResult";
import FriendRequestsRepository from "../repositories/FriendRequestsRepository";

export default class FriendRequestsService {
    private repository: FriendRequestsRepository;

    constructor(repository: FriendRequestsRepository = new FriendRequestsRepository()) {
        this.repository = repository;
    }

    async insert(requesterId: string, recipientId: string): Promise<IResult> {

        try {
            const result = await this.repository.insert(requesterId, recipientId);

            if (result.error) {
                throw new Error(result.message)
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                statusCode: 500,
                message: error.message
            };
        }
    }
}