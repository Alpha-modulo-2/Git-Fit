import { Request, Response } from "express";
import FriendRequestsService from "../services/FriendRequestsService";

export default class FriendRequestsController {
    private service: FriendRequestsService;

    constructor(service?: FriendRequestsService) {
        this.service = service || new FriendRequestsService();
        this.insert = this.insert.bind(this);
    }

    async insert(req: Request, res: Response) {
        const { requesterId, recipientId } = req.body

        try {
            const result = await this.service.insert(requesterId, recipientId);
            
            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Friend request created successfully",
                friendRequest: result
            });
        } catch (error: any) {
            console.log("Error creating friend request", error.message);
            return res.status(500).json({
                error: true,
                statusCode: 500,
                message: error.message
            });
        }
    }
}