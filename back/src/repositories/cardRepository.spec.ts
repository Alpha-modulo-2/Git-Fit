import CardRepository from "../repositories/CardRepository";
import ICard from "../interfaces/ICard";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";
import { Types  } from 'mongoose';
import CustomError from "../helpers/CustomError";
import { cardModel } from "../models/card";

describe('CardRepository', () => {
    let cardRepository: CardRepository;

    const userId = "123456789101112131415161";
    const cardId = "123456789101112131415161";

    const mockCards: ICard[] = [{
        _id: new Types.ObjectId(),
        userId: "123456789101112131415161",
        name: "Segunda-feira",
        created_at: new Date(),
        updated_at: new Date(),
        trainingCard: {
            checked: false,
            title: "Treino de Segunda-feira",
            tasks: [{
                _id: new Types.ObjectId(),
                description: "Exercício",
            }],
        },
        mealsCard: {
            checked: false,
            meals: [{
                _id: new Types.ObjectId(),
                description: "Refeição",
            }],
        },
    }];

    const mockTask: ITask = {
        _id: new Types.ObjectId('605cde4f1f29239b6a8d7f60'),
        description: "Test Task",
    };

    const mockMeal: IMeal = {
        _id: new Types.ObjectId('605cde4f1f29239b6a8d7f70'),
        description: "Test Meal",
    };

    beforeEach(() => {
        cardRepository = new CardRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('should insert cards', async () => {
            cardModel.insertMany = jest.fn().mockResolvedValue(mockCards);

            const result = await cardRepository.insert(mockCards);

            expect(cardModel.insertMany).toHaveBeenCalledWith(mockCards);
            expect(result).toEqual({
                error: false,
                statusCode: 201,
                card: mockCards
            });
        });

        it('should handle errors thrown from the model', async () => {
            const errorMsg = 'Test error';
            cardModel.insertMany = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.insert(mockCards);

            expect(cardModel.insertMany).toHaveBeenCalledWith(mockCards);
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('getAllCardsByUser', () => {
        it('should return all cards of a user', async () => {
            cardModel.find = jest.fn().mockResolvedValue(mockCards);
    
            const result = await cardRepository.getAllCardsByUser(userId);
    
            expect(cardModel.find).toHaveBeenCalledWith({userId: userId});
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: mockCards
            });
        });
    
        it('should handle the situation when no cards are found', async () => {
            cardModel.find = jest.fn().mockResolvedValue([]);
    
            try {
                await cardRepository.getAllCardsByUser(userId);
            } catch (error) {
                expect(cardModel.find).toHaveBeenCalledWith({userId: userId});
                expect(error).toEqual(new CustomError("Cards não encontrados.", 404));
            }
        });
    
        it('should handle errors thrown from the model', async () => {
            
            const errorMsg = 'Test error';
            cardModel.find = jest.fn().mockRejectedValue(new Error(errorMsg));
    
            const result = await cardRepository.getAllCardsByUser(userId);
    
            expect(cardModel.find).toHaveBeenCalledWith({userId: userId});
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('getOne', () => {
        it('should return a card by id', async () => {
            cardModel.findById = jest.fn().mockResolvedValue(mockCards[0]);

            const result = await cardRepository.getOne(cardId);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: mockCards[0]
            });
        });

        it('should handle the situation when no card is found', async () => {
            cardModel.findById = jest.fn().mockResolvedValue(null);

            try {
                await cardRepository.getOne(cardId);
            } catch (error) {
                expect(cardModel.findById).toHaveBeenCalledWith(cardId);
                expect(error).toEqual(new CustomError("Card não encontrado.", 404));
            }
        });

        it('should handle errors thrown from the model', async () => {
            const errorMsg = 'Test error';
            cardModel.findById = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.getOne(cardId);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('updateTrainingCardChecked', () => {
        it('should update the checked property of a card', async () => {
            const checked = true;
            const mockCard = { ...mockCards[0], save: jest.fn().mockResolvedValue({...mockCards[0], trainingCard: { checked: checked }}) };

            cardModel.findById = jest.fn().mockResolvedValue(mockCard);

            const result = await cardRepository.updateTrainingCardChecked(cardId, checked);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(mockCard.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: {...mockCards[0], trainingCard: { checked: checked }}
            });
        });

        it('should handle the situation when no card is found', async () => {
            const checked = true;
            cardModel.findById = jest.fn().mockResolvedValue(null);

            try {
                await cardRepository.updateTrainingCardChecked(cardId, checked);
            } catch (error) {
                expect(cardModel.findById).toHaveBeenCalledWith(cardId);
                expect(error).toEqual(new CustomError("Card não encontrado.", 404));
            }
        });

        it('should handle errors thrown from the model', async () => {
            const checked = true;
            const errorMsg = 'Test error';
            cardModel.findById = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.updateTrainingCardChecked(cardId, checked);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('updateMealsCardChecked', () => {
        it('should update the checked property of a meals card', async () => {
            const checked = true;
            const mockCard = { ...mockCards[0], save: jest.fn().mockResolvedValue({...mockCards[0], mealsCard: { checked: checked }}) };

            cardModel.findById = jest.fn().mockResolvedValue(mockCard);

            const result = await cardRepository.updateMealsCardChecked(cardId, checked);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(mockCard.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: {...mockCards[0], mealsCard: { checked: checked }}
            });
        });

        it('should handle the situation when no card is found', async () => {
            const checked = true;
            cardModel.findById = jest.fn().mockResolvedValue(null);

            try {
                await cardRepository.updateMealsCardChecked(cardId, checked);
            } catch (error) {
                expect(cardModel.findById).toHaveBeenCalledWith(cardId);
                expect(error).toEqual(new CustomError("Card não encontrado.", 404));
            }
        });

        it('should handle errors thrown from the model', async () => {
            const checked = true;
            const errorMsg = 'Test error';
            cardModel.findById = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.updateMealsCardChecked(cardId, checked);

            expect(cardModel.findById).toHaveBeenCalledWith(cardId);
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('addTask', () => {
        it('should add a task to a card', async () => {
            const updatedCard = {...mockCards[0], trainingCard: { ...mockCards[0].trainingCard, tasks: [...mockCards[0].trainingCard.tasks, mockTask]}};

            cardModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.addTask(cardId, mockTask);

            expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"trainingCard.tasks": mockTask}}, {new: true});
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: updatedCard
            });
        });

        it('should handle the situation when no card is found', async () => {
            cardModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            try {
                await cardRepository.addTask(cardId, mockTask);
            } catch (error) {
                expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"trainingCard.tasks": mockTask}}, {new: true});
                expect(error).toEqual(new CustomError("Card não encontrado.", 404));
            }
        });

        it('should handle errors thrown from the model', async () => {
            const errorMsg = 'Test error';

            cardModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.addTask(cardId, mockTask);

            expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"trainingCard.tasks": mockTask}}, {new: true});
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('addMeal', () => {
        it('should add a meal to a card', async () => {
            const updatedCard = {...mockCards[0], mealsCard: { ...mockCards[0].mealsCard, meals: [...mockCards[0].mealsCard.meals, mockMeal]}};

            cardModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.addMeal(cardId, mockMeal);

            expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"mealsCard.meals": mockMeal}}, {new: true});
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: updatedCard
            });
        });

        it('should handle the situation when no card is found', async () => {
            cardModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            try {
                await cardRepository.addMeal(cardId, mockMeal);
            } catch (error) {
                expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"mealsCard.meals": mockMeal}}, {new: true});
                expect(error).toEqual(new CustomError("Card não encontrado.", 404));
            }
        });

        it('should handle errors thrown from the model', async () => {
            const errorMsg = 'Test error';

            cardModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.addMeal(cardId, mockMeal);

            expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, {$push: {"mealsCard.meals": mockMeal}}, {new: true});
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('updateTitle', () => {
        it('should update a title of a card', async () => {
            const newTitle = "Novo título";
            const updatedCard = {...mockCards[0], trainingCard: { ...mockCards[0].trainingCard, title: newTitle }};

            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.updateTitle(cardId, newTitle);

            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith({_id: cardId}, {'trainingCard.title': newTitle}, {new: true});
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: updatedCard
            });
        });

        it('should handle the situation when no card is found', async () => {
            const newTitle = "Novo título";

            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

            const result = await cardRepository.updateTitle(cardId, newTitle);

            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith({_id: cardId}, {'trainingCard.title': newTitle}, {new: true});
            expect(result).toEqual({
                error: true,
                statusCode: 404,
                message: "Card não encontrado.",
            });
        });

        it('should handle errors thrown from the model', async () => {
            const newTitle = "Novo título";
            const errorMsg = 'Test error';

            cardModel.findOneAndUpdate = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.updateTitle(cardId, newTitle);

            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith({_id: cardId}, {'trainingCard.title': newTitle}, {new: true});
            expect(result).toEqual({
                error: true,
                message: "Erro interno do servidor.",
                statusCode: 500,
            });
        });
    });

    describe('updateTask', () => {
        it('should update a task', async () => {
            const taskId = "123456789101112131415161";
            const newDescription = "Nova descrição";
            const updatedCard = {...mockCards[0], 
                trainingCard: {
                    ...mockCards[0].trainingCard, 
                    tasks: mockCards[0].trainingCard.tasks.map(task => 
                        task._id === taskId ? { ...task, description: newDescription } : task
                    )
                }};

            cardModel.findOne = jest.fn().mockResolvedValue(mockCards[0]);
            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.updateTask(taskId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockCards[0]._id, "trainingCard.tasks._id": taskId }, 
                { $set: { "trainingCard.tasks.$.description": newDescription } }, 
                { new: true }
            );
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: updatedCard,
            });
        });

        it('should handle the situation when no task is found', async () => {
            const taskId = "123456789101112131415161";
            const newDescription = "Nova descrição";

            cardModel.findOne = jest.fn().mockResolvedValue(null);

            const result = await cardRepository.updateTask(taskId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(result).toEqual({
                error: true,
                statusCode: 404,
                message: "Task não encontrado.",
            });
        });

        it('should handle errors thrown from the model', async () => {
            const taskId = "123456789101112131415161";
            const newDescription = "Nova descrição";
            const errorMsg = 'Test error';

            cardModel.findOne = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.updateTask(taskId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('updateMeal', () => {
        it('should update a meal', async () => {
            const mealId = "123456789101112131415161";
            const newDescription = "Nova descrição";
            const updatedCard = {...mockCards[0], 
                mealsCard: {
                    ...mockCards[0].mealsCard, 
                    meals: mockCards[0].mealsCard.meals.map(meal => 
                        meal._id === mealId ? { ...meal, description: newDescription } : meal
                    )
                }};

            cardModel.findOne = jest.fn().mockResolvedValue(mockCards[0]);
            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.updateMeal(mealId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockCards[0]._id, "mealsCard.meals._id": mealId }, 
                { $set: { "mealsCard.meals.$.description": newDescription } }, 
                { new: true }
            );
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                card: updatedCard,
            });
        });

        it('should handle the situation when no meal is found', async () => {
            const mealId = "123456789101112131415161";
            const newDescription = "Nova descrição";

            cardModel.findOne = jest.fn().mockResolvedValue(null);

            const result = await cardRepository.updateMeal(mealId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(result).toEqual({
                error: true,
                statusCode: 404,
                message: "Refeição não encontrada.",
            });
        });

        it('should handle errors thrown from the model', async () => {
            const mealId = "123456789101112131415161";
            const newDescription = "Nova descrição";
            const errorMsg = 'Test error';

            cardModel.findOne = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.updateMeal(mealId, newDescription);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('delTask', () => {
        it('should delete a task', async () => {
            const taskId = "123456789101112131415161";
            const updatedCard = {...mockCards[0], 
                trainingCard: {
                    ...mockCards[0].trainingCard, 
                    tasks: mockCards[0].trainingCard.tasks.filter(task => 
                        task._id !== taskId
                    )
                }};

            cardModel.findOne = jest.fn().mockResolvedValue(mockCards[0]);
            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.delTask(taskId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockCards[0]._id }, 
                { $pull: { 'trainingCard.tasks': { _id: taskId } } },
                { new: true }
            );
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                message: "Task deletada."
            });
        });

        it('should handle the situation when no task is found', async () => {
            const taskId = "123456789101112131415161";

            cardModel.findOne = jest.fn().mockResolvedValue(null);

            const result = await cardRepository.delTask(taskId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(result).toEqual({
                error: true,
                statusCode: 404,
                message: "Task não encontrada.",
            });
        });

        it('should handle errors thrown from the model', async () => {
            const taskId = "123456789101112131415161";
            const errorMsg = 'Test error';

            cardModel.findOne = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.delTask(taskId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "trainingCard.tasks._id": taskId });
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });

    describe('delMeal', () => {
        it('should delete a meal', async () => {
            const mealId = "123456789101112131415161";
            const updatedCard = {...mockCards[0], 
                mealsCard: {
                    ...mockCards[0].mealsCard, 
                    meals: mockCards[0].mealsCard.meals.filter(meal => 
                        meal._id !== mealId
                    )
                }};

            cardModel.findOne = jest.fn().mockResolvedValue(mockCards[0]);
            cardModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCard);

            const result = await cardRepository.delMeal(mealId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(cardModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockCards[0]._id }, 
                { $pull: { 'mealsCard.meals': { _id: mealId } } },
                { new: true }
            );
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                message: "Refeição deletada."
            });
        });

        it('should handle the situation when no meal is found', async () => {
            const mealId = "123456789101112131415161";

            cardModel.findOne = jest.fn().mockResolvedValue(null);

            const result = await cardRepository.delMeal(mealId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(result).toEqual({
                error: true,
                statusCode: 404,
                message: "Refeição não encontrada.",
            });
        });

        it('should handle errors thrown from the model', async () => {
            const mealId = "123456789101112131415161";
            const errorMsg = 'Test error';

            cardModel.findOne = jest.fn().mockRejectedValue(new Error(errorMsg));

            const result = await cardRepository.delMeal(mealId);

            expect(cardModel.findOne).toHaveBeenCalledWith({ "mealsCard.meals._id": mealId });
            expect(result).toEqual({
                error: true,
                message: errorMsg,
                statusCode: 500,
            });
        });
    });
})