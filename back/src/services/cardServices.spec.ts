import CardService from "./CardServices";
import CardRepository, { cardCronJob } from "../repositories/CardRepository";
import ICard from "../interfaces/ICard";
import { Types } from 'mongoose';
import CustomError from "../helpers/CustomError";
import ITask from "../interfaces/ITask";
import IMeal from "../interfaces/IMeal";

interface MockCardRepository extends CardRepository {
    hasCards: jest.Mock;
    insert: jest.Mock;
    getAllCardsByUser: jest.Mock;
    getOne: jest.Mock;
    updateTrainingCardChecked: jest.Mock;
    updateMealsCardChecked: jest.Mock;
    addTask: jest.Mock;
    addMeal: jest.Mock;
    updateTitle: jest.Mock;
    updateTask: jest.Mock;
    updateMeal: jest.Mock;
    delTask: jest.Mock;
    delMeal: jest.Mock;
}

describe('CardService', () => {
    let cardService: CardService;
    let cardRepository: MockCardRepository;

    const mockCard: ICard = {
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
    };

    const mockTask: ITask = {
        _id: new Types.ObjectId('605cde4f1f29239b6a8d7f60'),
        description: "Test Task",
    };

    const mockMeal: IMeal = {
        _id: new Types.ObjectId('605cde4f1f29239b6a8d7f70'),
        description: "Test Meal",
    };

    beforeEach(() => {
        cardRepository = {
            hasCards: jest.fn(),
            insert: jest.fn(),
            getAllCardsByUser: jest.fn(),
            getOne: jest.fn(),
            updateTrainingCardChecked: jest.fn(),
            updateMealsCardChecked: jest.fn(),
            addTask: jest.fn(),
            addMeal: jest.fn(),
            updateTitle: jest.fn(),
            updateTask: jest.fn(),
            updateMeal: jest.fn(),
            delTask: jest.fn(),
            delMeal: jest.fn(),
        } as MockCardRepository;

        cardService = new CardService(cardRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        cardCronJob.stop()
    });

    describe('insert', () => {
        it('should insert a card', async () => {
            cardRepository.hasCards.mockResolvedValue(false);
            cardRepository.insert.mockResolvedValue({
                error: false,
                statusCode: 201,
                cards: [mockCard]
            });

            const result = await cardService.insert(mockCard.userId.toString());

            expect(cardRepository.hasCards).toHaveBeenCalledWith(mockCard.userId);
            expect(cardRepository.insert).toHaveBeenCalled();
            expect(result).toEqual({
                error: false,
                statusCode: 201,
                cards: [mockCard]
            });
        });

        it('should throw an error if cards already exist', async () => {
            cardRepository.hasCards.mockResolvedValue(true);

            try {
                await cardService.insert(mockCard.userId.toString());
            } catch (err) {
                expect(err).toEqual(new CustomError("Cards já existem para este usuário", 400));
            }

            expect(cardRepository.hasCards).toHaveBeenCalledWith(mockCard.userId);
            expect(cardRepository.insert).not.toHaveBeenCalled();
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.hasCards.mockRejectedValue(new Error('Test error'));

            const result = await cardService.insert(mockCard.userId.toString());

            expect(cardRepository.hasCards).toHaveBeenCalledWith(mockCard.userId);
            expect(result).toEqual({
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            });
        });
    });

    describe('getAllCardsByUser', () => {
        it('should get all cards by user', async () => {
            const expectedCards = [mockCard];
            cardRepository.getAllCardsByUser.mockResolvedValue({
                error: false,
                statusCode: 200,
                cards: expectedCards
            });

            const result = await cardService.getAllCardsByUser(mockCard.userId.toString());

            expect(cardRepository.getAllCardsByUser).toHaveBeenCalledWith(mockCard.userId.toString());
            expect(result).toEqual({
                error: false,
                statusCode: 200,
                cards: expectedCards
            });
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.getAllCardsByUser.mockRejectedValue(new Error('Test error'));

            const result = await cardService.getAllCardsByUser(mockCard.userId.toString());

            expect(cardRepository.getAllCardsByUser).toHaveBeenCalledWith(mockCard.userId.toString());
            expect(result).toEqual({
                error: true,
                statusCode: 500,
                message: "Erro interno do servidor."
            });
        });
    });

    describe('getOne', () => {
        it('should get one card', async () => {
            cardRepository.getOne.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: mockCard,
            });

            if (mockCard._id) {
                const result = await cardService.getOne(mockCard._id.toString());

                expect(cardRepository.getOne).toHaveBeenCalledWith(mockCard._id.toString());
                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: mockCard
                });
            }
        });

        it('should return a server error if the repository throws', async () => {
            cardRepository.getOne.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.getOne(mockCard._id.toString());

                expect(cardRepository.getOne).toHaveBeenCalledWith(mockCard._id.toString());
                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('updateTrainingCardChecked', () => {
        it('should update the training card checked status', async () => {
            cardRepository.updateTrainingCardChecked.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    trainingCard: {
                        ...mockCard.trainingCard,
                        checked: true
                    },
                },
            });

            if (mockCard._id) {
                const result = await cardService.updateTrainingCardChecked(mockCard._id.toString(), true);

                expect(cardRepository.updateTrainingCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        trainingCard: {
                            ...mockCard.trainingCard,
                            checked: true
                        },
                    },
                });
            }

        });

        it('should return a server error if the repository throws', async () => {
            cardRepository.updateTrainingCardChecked.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.updateTrainingCardChecked(mockCard._id.toString(), true);

                expect(cardRepository.updateTrainingCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('updateMealsCardChecked', () => {
        it('should update the meals card checked status', async () => {
            cardRepository.updateMealsCardChecked.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    mealsCard: {
                        ...mockCard.mealsCard,
                        checked: true
                    },
                },
            });

            if (mockCard._id) {
                const result = await cardService.updateMealsCardChecked(mockCard._id.toString(), true);

                expect(cardRepository.updateMealsCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        mealsCard: {
                            ...mockCard.mealsCard,
                            checked: true
                        },
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.updateMealsCardChecked.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.updateMealsCardChecked(mockCard._id.toString(), true);

                expect(cardRepository.updateMealsCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('addTask', () => {

        it('should add a task to a card', async () => {
            cardRepository.addTask.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    trainingCard: {
                        ...mockCard.trainingCard,
                        tasks: [...mockCard.trainingCard.tasks, mockTask],
                    },
                },
            });

            if (mockCard._id) {
                const result = await cardService.addTask(mockCard._id.toString(), mockTask);

                expect(cardRepository.addTask).toHaveBeenCalledWith(mockCard._id.toString(), mockTask);

                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        trainingCard: {
                            ...mockCard.trainingCard,
                            tasks: [...mockCard.trainingCard.tasks, mockTask],
                        },
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.addTask.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.addTask(mockCard._id.toString(), mockTask);

                expect(cardRepository.addTask).toHaveBeenCalledWith(mockCard._id.toString(), mockTask);
                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('addMeal', () => {
        it('should add a meal to a card', async () => {
            cardRepository.addMeal.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    mealsCard: {
                        ...mockCard.mealsCard,
                        meals: [...mockCard.mealsCard.meals, mockMeal],
                    },
                },
            });

            if (mockCard._id) {
                const result = await cardService.addMeal(mockCard._id.toString(), mockMeal);

                expect(cardRepository.addMeal).toHaveBeenCalledWith(mockCard._id.toString(), mockMeal);

                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        mealsCard: {
                            ...mockCard.mealsCard,
                            meals: [...mockCard.mealsCard.meals, mockMeal],
                        },
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.addMeal.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.addMeal(mockCard._id.toString(), mockMeal);

                expect(cardRepository.addMeal).toHaveBeenCalledWith(mockCard._id.toString(), mockMeal);

                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('updateTitle', () => {
        const newTitle = "New Test Title";

        it('should update the title of a card', async () => {
            cardRepository.updateTitle.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    name: newTitle,
                },
            });

            if (mockCard._id) {
                const result = await cardService.updateTitle(mockCard._id.toString(), newTitle);

                expect(cardRepository.updateTitle).toHaveBeenCalledWith(mockCard._id.toString(), newTitle);

                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        name: newTitle,
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.updateTitle.mockRejectedValue(new Error('Test error'));

            if (mockCard._id) {
                const result = await cardService.updateTitle(mockCard._id.toString(), newTitle);


                expect(cardRepository.updateTitle).toHaveBeenCalledWith(mockCard._id.toString(), newTitle);

                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('updateTask', () => {
        const newDescription = "New Test Task Description";

        it('should update the description of a task', async () => {
            cardRepository.updateTask.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    trainingCard: {
                        ...mockCard.trainingCard,
                        tasks: [
                            {
                                ...mockCard.trainingCard.tasks[0],
                                description: newDescription
                            }
                        ]
                    },
                },
            });

            if (mockCard.trainingCard.tasks[0]._id) {
                const result = await cardService.updateTask(mockCard.trainingCard.tasks[0]._id.toString(), newDescription);

                expect(cardRepository.updateTask).toHaveBeenCalledWith(mockCard.trainingCard.tasks[0]._id.toString(), newDescription);

                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        trainingCard: {
                            ...mockCard.trainingCard,
                            tasks: [
                                {
                                    ...mockCard.trainingCard.tasks[0],
                                    description: newDescription
                                }
                            ]
                        },
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.updateTask.mockRejectedValue(new Error('Test error'));

            if (mockCard.trainingCard.tasks[0]._id) {
                const result = await cardService.updateTask(mockCard.trainingCard.tasks[0]._id.toString(), newDescription);

                expect(cardRepository.updateTask).toHaveBeenCalledWith(mockCard.trainingCard.tasks[0]._id.toString(), newDescription);

                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('updateMeal', () => {
        const newDescription = "New Test Meal Description";

        it('should update the description of a meal', async () => {
            cardRepository.updateMeal.mockResolvedValue({
                error: false,
                statusCode: 200,
                card: {
                    ...mockCard,
                    mealsCard: {
                        ...mockCard.mealsCard,
                        meals: [
                            {
                                ...mockCard.mealsCard.meals[0],
                                description: newDescription
                            }
                        ]
                    },
                },
            });

            if (mockCard.mealsCard.meals[0]._id) {
                const result = await cardService.updateMeal(mockCard.mealsCard.meals[0]._id.toString(), newDescription);

                expect(cardRepository.updateMeal).toHaveBeenCalledWith(mockCard.mealsCard.meals[0]._id.toString(), newDescription);

                expect(result).toEqual({
                    error: false,
                    statusCode: 200,
                    card: {
                        ...mockCard,
                        mealsCard: {
                            ...mockCard.mealsCard,
                            meals: [
                                {
                                    ...mockCard.mealsCard.meals[0],
                                    description: newDescription
                                }
                            ]
                        },
                    },
                });
            }
        });

        it('should handle errors thrown from repository', async () => {
            cardRepository.updateMeal.mockRejectedValue(new Error('Test error'));

            if (mockCard.mealsCard.meals[0]._id) {
                const result = await cardService.updateMeal(mockCard.mealsCard.meals[0]._id.toString(), newDescription);

                expect(cardRepository.updateMeal).toHaveBeenCalledWith(mockCard.mealsCard.meals[0]._id.toString(), newDescription);

                expect(result).toEqual({
                    error: true,
                    statusCode: 500,
                    message: "Erro interno do servidor."
                });
            }
        });
    });

    describe('delTask', () => {
        it('should delete a task', async () => {
            if (mockCard.trainingCard?.tasks?.length > 0) {
                const taskId = mockCard.trainingCard.tasks[0]._id?.toString();
                if (taskId) {
                    cardRepository.delTask.mockResolvedValue({
                        error: false,
                        statusCode: 200,
                        card: {
                            ...mockCard,
                            trainingCard: {
                                ...mockCard.trainingCard,
                                tasks: mockCard.trainingCard.tasks.filter(task => task._id?.toString() !== taskId)
                            },
                        },
                    });

                    const result = await cardService.delTask(taskId);

                    expect(cardRepository.delTask).toHaveBeenCalledWith(taskId);
                    expect(result).toEqual({
                        error: false,
                        statusCode: 200,
                        card: {
                            ...mockCard,
                            trainingCard: {
                                ...mockCard.trainingCard,
                                tasks: mockCard.trainingCard.tasks.filter(task => task._id?.toString() !== taskId)
                            },
                        },
                    });
                }
            }
        });

        it('should handle errors thrown from repository', async () => {
            if (mockCard.trainingCard?.tasks?.length > 0) {
                const taskId = mockCard.trainingCard.tasks[0]._id?.toString();
                if (taskId) {
                    cardRepository.delTask.mockRejectedValue(new Error('Test error'));

                    const result = await cardService.delTask(taskId);

                    expect(cardRepository.delTask).toHaveBeenCalledWith(taskId);
                    expect(result).toEqual({
                        error: true,
                        statusCode: 500,
                        message: "Erro interno do servidor."
                    });
                }
            }
        });
    });

    describe('delMeal', () => {
        it('should delete a meal', async () => {
            if (mockCard.mealsCard?.meals?.length > 0) {
                const mealId = mockCard.mealsCard.meals[0]._id?.toString();
                if (mealId) {
                    cardRepository.delMeal.mockResolvedValue({
                        error: false,
                        statusCode: 200,
                        card: {
                            ...mockCard,
                            mealsCard: {
                                ...mockCard.mealsCard,
                                meals: mockCard.mealsCard.meals.filter(meal => meal._id?.toString() !== mealId)
                            },
                        },
                    });

                    const result = await cardService.delMeal(mealId);

                    expect(cardRepository.delMeal).toHaveBeenCalledWith(mealId);
                    expect(result).toEqual({
                        error: false,
                        statusCode: 200,
                        card: {
                            ...mockCard,
                            mealsCard: {
                                ...mockCard.mealsCard,
                                meals: mockCard.mealsCard.meals.filter(meal => meal._id?.toString() !== mealId)
                            },
                        },
                    });
                }
            }
        });

        it('should handle errors thrown from repository', async () => {
            if (mockCard.mealsCard?.meals?.length > 0) {
                const mealId = mockCard.mealsCard.meals[0]._id?.toString();
                if (mealId) {
                    cardRepository.delMeal.mockRejectedValue(new Error('Test error'));

                    const result = await cardService.delMeal(mealId);

                    expect(cardRepository.delMeal).toHaveBeenCalledWith(mealId);
                    expect(result).toEqual({
                        error: true,
                        statusCode: 500,
                        message: "Erro interno do servidor."
                    });
                }
            }
        });
    });
});