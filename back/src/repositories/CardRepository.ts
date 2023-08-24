import IResult from "../interfaces/IResult";
import { Types } from 'mongoose';
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
import { cardModel } from "../models/card";
import CustomError from "../helpers/CustomError";
import cron from 'node-cron';

export default class CardRepository {

    async insert(cards: ICard[]): Promise<IResult> {
        try {
            const result = await cardModel.insertMany(cards);

            return {
                error: false,
                statusCode: 201,
                card: result,
            };
        } catch (error: any) {
            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            };
        }
    }

    async getAllCardsByUser(userId: string): Promise<IResult> {
        try {
            const cards = await cardModel.find({ userId: userId })

            if (!cards || cards.length === 0) {
                throw new CustomError("Cards não encontrados.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: cards,
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async getOne(cardId: string): Promise<IResult> {
        try {
            const card = await cardModel.findById(cardId)

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: card
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async updateTrainingCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const card = await cardModel.findById(cardId);

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            card.trainingCard.checked = checked;
            const updatedCard = await card.save();

            return {
                error: false,
                statusCode: 200,
                card: updatedCard,
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async updateMealsCardChecked(cardId: string, checked: boolean): Promise<IResult> {
        try {
            const card = await cardModel.findById(cardId);

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            card.mealsCard.checked = checked;
            const updatedCard = await card.save();

            return {
                error: false,
                statusCode: 200,
                card: updatedCard,
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async addTask(cardId: string, task: ITask): Promise<IResult> {
        try {
            // Creates Id, ensuring that every task in has a unique identifier and don't change or duplicate
            if (!task._id) {
                task._id = new Types.ObjectId();
            }

            const card = await cardModel.findByIdAndUpdate(
                cardId,
                { $push: { "trainingCard.tasks": task } },
                { new: true }
            );

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: card,
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async addMeal(cardId: string, meal: IMeal): Promise<IResult> {
        try {
            if (!meal._id) {
                meal._id = new Types.ObjectId();
            }

            const card = await cardModel.findByIdAndUpdate(
                cardId,
                { $push: { "mealsCard.meals": meal } },
                { new: true }
            );

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: card,
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async updateTitle(cardId: string, title: string): Promise<IResult> {
        try {
            const card = await cardModel.findOneAndUpdate(
                { _id: cardId },
                { 'trainingCard.title': title },
                { new: true }
            );

            if (!card) {
                throw new CustomError("Card não encontrado.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: card,
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }
            return {
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor.",
            };
        }
    }

    async updateTask(taskId: string, description: string): Promise<IResult> {
        try {
            const card = await cardModel.findOne({ "trainingCard.tasks._id": taskId });

            if (!card) {
                throw new CustomError("Task não encontrado.", 404);
            }

            const updatedCard = await cardModel.findOneAndUpdate(
                { _id: card._id, "trainingCard.tasks._id": taskId },
                { $set: { "trainingCard.tasks.$.description": description } },
                { new: true }
            );

            if (!updatedCard) {
                throw new CustomError("Task não atualizado.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: updatedCard,
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async updateMeal(mealId: string, description: string): Promise<IResult> {
        try {

            const card = await cardModel.findOne({ "mealsCard.meals._id": mealId });

            if (!card) {
                throw new CustomError("Refeição não encontrada.", 404);
            }

            const updatedCard = await cardModel.findOneAndUpdate(
                { _id: card._id, "mealsCard.meals._id": mealId },
                { $set: { "mealsCard.meals.$.description": description } },
                { new: true }
            );

            if (!updatedCard) {
                throw new CustomError("Refeição não atualizada.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                card: updatedCard
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async delTask(taskId: string): Promise<IResult> {
        try {

            const card = await cardModel.findOne({ "trainingCard.tasks._id": taskId });

            if (!card) {
                throw new CustomError("Task não encontrada.", 404);
            }

            const updatedCard = await cardModel.findOneAndUpdate(
                { _id: card._id },
                { $pull: { 'trainingCard.tasks': { _id: taskId } } },
                { new: true }
            );

            if (!updatedCard) {
                throw new CustomError("Task não deletada.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                message: "Task deletada."
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async delMeal(mealId: string): Promise<IResult> {
        try {
            const card = await cardModel.findOne({ "mealsCard.meals._id": mealId });

            if (!card) {
                throw new CustomError("Refeição não encontrada.", 404);
            }

            const updatedCard = await cardModel.findOneAndUpdate(
                { _id: card._id },
                { $pull: { 'mealsCard.meals': { _id: mealId } } },
                { new: true }
            );

            if (!updatedCard) {
                throw new CustomError("Refeição não deletada.", 404);
            }

            return {
                error: false,
                statusCode: 200,
                message: "Refeição deletada."
            };
        } catch (error: any) {
            if (error instanceof CustomError) {
                return {
                    error: true,
                    statusCode: error.statusCode,
                    message: error.message,
                };
            }

            return {
                error: true,
                message: error.message || "Erro interno do servidor",
                statusCode: 500,
            }
        }
    }

    async hasCards(userId: string): Promise<boolean> {
        const existingCards = await cardModel.findOne({ userId });
        return !!existingCards;
    }
}

export const cardCronJob = cron.schedule('0 0 * * SUN', async () => {
    console.log('Running a job every Sunday at 00:00 to reset checks');
    try {
        await cardModel.updateMany(
            {},
            {
                $set: {
                    'trainingCard.checked': false,
                    'mealsCard.checked': false
                }
            }
        );
        console.log('All checked values in trainingCard and mealsCard have been set to false');
    } catch (error) {
        console.error('Error updating checks:', error);
    }
}, {
    timezone: "America/Sao_Paulo"
});