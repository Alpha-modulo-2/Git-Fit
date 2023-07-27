import IResult from "../interfaces/IResult";
import { friendRequestsModel } from "../models/friendRequests";

export default class FriendRequestsRepository {
    async insert(requesterId: string, recipientId: string): Promise<IResult> {

        try {

            const result = await friendRequestsModel.create({ 
                requester: requesterId, 
                recipient: recipientId, 
                status: 'pending' 
            })
    
            return {
                error: false,
                statusCode: 201,
                friendRequests: result,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: 500,
            }
        }
    }
}