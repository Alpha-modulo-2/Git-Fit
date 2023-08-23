import cron from 'node-cron';
import { cardModel } from '../models/card';
import { userModel } from '../models/user';
import { UserSummaryModel } from '../models/userSummary';

cron.schedule('0 0 * * SUN', async () => {
    console.log('Populating UserSummary data');

    try {
        const users = await userModel.find({});

        for (let user of users) {
            const trainingCardChecks = await cardModel.countDocuments({ userId: user._id, 'trainingCard.checked': true });
            const mealsCardChecks = await cardModel.countDocuments({ userId: user._id, 'mealsCard.checked': true });

            const summary = new UserSummaryModel({
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
});