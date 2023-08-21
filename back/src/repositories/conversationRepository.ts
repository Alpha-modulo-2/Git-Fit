import IConversation from "../interfaces/IConversation";
import IResult from "../interfaces/IResult";
import { conversationModel } from "../models/conversation";
import { messageModel } from "../models/message";

export default class ConversationRepository {
    async create(data: IConversation): Promise<IResult> {
        try {

            const existingConversation = await conversationModel.findOne({
                members: {
                    $all: data.members
                }
            });

            if (existingConversation) {
                const error = {
                    message: "Conversa já existe.",
                    code: 403
                }
                throw error
            }

            const result = await conversationModel.create(data)

            if (!result) {
                const error = {
                    message: "Conversa não Criada.",
                    code: 404
                }
                throw error
            }

            return {
                error: false,
                statusCode: 201,
                conversation: result
            }



        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }

    async get(userId: string): Promise<IResult> {
        try {

            const results = await conversationModel.find({ members: { $in: userId } }).populate("members", { userName: 1, name: 1, photo: 1, occupation: 1, id: 1 });

            if (!results || results.length === 0) {
                throw new Error("Erro no servidor")
            }

            const resultsJSON = results.map(result => result.toJSON());

            const unreadCountsPromises = resultsJSON.map(async (conversation: IConversation) => {
                const count = await messageModel.countDocuments({
                    chatId: conversation._id,
                    sender: { $ne: userId },
                    isRead: false
                });
                return {
                    ...conversation, unreadCount: count
                };
            });

            const unreadCounts = await Promise.all(unreadCountsPromises);

            return {
                error: false,
                statusCode: 200,
                conversation: unreadCounts
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