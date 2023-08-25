import IResult from "../interfaces/IResult";
import cron from 'node-cron';
import { cardModel } from "../models/card";
import { userModel } from "../models/user";
import { userSummaryModel } from "../models/userSummary";

export default class UserSummaryRepository {

    async getOne(id: string): Promise<IResult> {

        try {

            const userSummary = await userSummaryModel.find({ user: id });

            if (!userSummary) {
                const error = {
                    error: true,
                    statusCode: 404,
                    message: "Histórico do Usuário não encontrado"
                }
                throw error
            }

            return {
                error: false,
                statusCode: 200,
                userSummary: userSummary,
            }
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500,
            }
        }
    }
}

export const summaryCronJob = cron.schedule('0 0 * * SUN', async () => {

    try {
        console.log('Populating UserSummary data');
        const users = await userModel.find({});

        for (let user of users) {
            const trainingCardChecks = await cardModel.countDocuments({ userId: user._id, 'trainingCard.checked': true });
            const mealsCardChecks = await cardModel.countDocuments({ userId: user._id, 'mealsCard.checked': true });

            const summary = new userSummaryModel({
                user: user._id,
                weight: user.weight,
                checks: {
                    trainingCard: trainingCardChecks,
                    mealsCard: mealsCardChecks
                }
            });

            await summary.save();
        }

        console.log('UserSummary data populated');
    } catch (error) {
        console.error('Error populating UserSummary data:', error);
    }
}, {
    timezone: "America/Sao_Paulo"
});