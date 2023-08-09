import CardController from '../controllers/CardController';
import ICard from '../interfaces/ICard';
import ITask from '../interfaces/ITask';
import IMeal from '../interfaces/IMeal';
import CardService from '../services/CardServices';
import { Types  } from 'mongoose';

interface MockCardService extends CardService {
    insert: jest.Mock;
    getAllCardsByUser: jest.Mock;
    getOne: jest.Mock;
    updateTrainingCardChecked: jest.Mock;
    updateMealsCardChecked: jest.Mock;
    addTask: jest.Mock;
    addMeal: jest.Mock;
    updateTitle: jest.Mock;
    updateMeal: jest.Mock;
    updateTask: jest.Mock;
    delTask: jest.Mock;
    delMeal: jest.Mock;
}

const INVALID_USER_ID_MESSAGE = "ID do usuário inválido";

describe('CardController', () => {
    let req: any, res: any;
    let cardController: CardController;
    let cardService: MockCardService;

    const mockCard: ICard = {
        _id: new Types.ObjectId(),
        userId: "123456789101112131415161",
        name: "Segunda-feira",
        created_at: new Date(),
        updated_at: new Date(),
        trainingCard: {
            checked: false,
            title: "Treino de Segunda-feira",
            tasks: [],
        },
        mealsCard: {
            checked: false,
            meals: [],
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
        req = { body: {}, params: {} };
        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };

        cardService = {
            insert: jest.fn(), 
            getAllCardsByUser: jest.fn(),
            getOne: jest.fn(),
            updateTrainingCardChecked: jest.fn(),
            updateMealsCardChecked: jest.fn(),
            addTask: jest.fn(),
            addMeal: jest.fn(),
            updateTitle: jest.fn(),
            updateMeal: jest.fn(),
            updateTask: jest.fn(),
            delTask: jest.fn(),
            delMeal: jest.fn(),
        } as MockCardService;

        cardController = new CardController(cardService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('should insert a card', async () => {
            req.params.userId = '123456789101112131415161';

            cardService.insert.mockResolvedValue({ error: false, statusCode: 201, card: mockCard });

            await cardController.insert(req, res);

            expect(cardService.insert).toHaveBeenCalledWith(mockCard.userId);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                "error": false,
                "statusCode": 201, 
                "card": mockCard
            });
        });

        it('should return error if userId is invalid', async () => {
            req.params.userId = 'invalidId';

            await cardController.insert(req, res);

            expect(cardService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });

        it('should return a server error if the service throws', async () => {
            req.params.userId = '123456789101112131415161';

            cardService.insert.mockRejectedValue(new Error('Test error'));

            await cardController.insert(req, res);

            expect(cardService.insert).toHaveBeenCalledWith(mockCard.userId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: 'Test error',
            });
        });

        it('should return error if userId is missing', async () => {
            req.params.userId = undefined;
    
            await cardController.insert(req, res);
    
            expect(cardService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });
    
        it('should return error if userId is empty', async () => {
            req.params.userId = '';
    
            await cardController.insert(req, res);
    
            expect(cardService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });
    
        it('should return error if userId is not a string', async () => {
            req.params.userId = 123456;
    
            await cardController.insert(req, res);
    
            expect(cardService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });
    
        it('should return error if userId is a string, but not 24 characters hex string', async () => {
            req.params.userId = '123';
    
            await cardController.insert(req, res);
    
            expect(cardService.insert).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });
    });

    describe('getAllCardsByUser', () => {
        it('should return all cards of a user', async () => {
            req.params.userId = '123456789101112131415161';
            
            const cards = [mockCard, mockCard];
            cardService.getAllCardsByUser.mockResolvedValue({ error: false, statusCode: 200, card: cards });
    
            await cardController.getAllCardsByUser(req, res);
    
            expect(cardService.getAllCardsByUser).toHaveBeenCalledWith(mockCard.userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                "error": false,
                "statusCode": 200, 
                "card": cards
            });
        });
    
        it('should return error if userId is invalid', async () => {
            req.params.userId = 'invalidId';
    
            await cardController.getAllCardsByUser(req, res);
    
            expect(cardService.getAllCardsByUser).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: INVALID_USER_ID_MESSAGE
            });
        });
    
        it('should return a server error if the service throws', async () => {
            req.params.userId = '123456789101112131415161';
    
            cardService.getAllCardsByUser.mockRejectedValue(new Error('Test error'));
    
            await cardController.getAllCardsByUser(req, res);
    
            expect(cardService.getAllCardsByUser).toHaveBeenCalledWith(mockCard.userId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                message: 'Test error',
            });
        });
    
        it('should return error if no cards found', async () => {
            req.params.userId = '123456789101112131415161';

            cardService.getAllCardsByUser.mockResolvedValue({ error: true, statusCode: 404, message: "Card não encontrado" });
        
            await cardController.getAllCardsByUser(req, res);
        
            expect(cardService.getAllCardsByUser).toHaveBeenCalledWith(mockCard.userId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                "error": true, 
                "message": "Card não encontrado", "statusCode": 404});
        });
    });

    describe('getOne', () => {
        it('should return a card', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();

                cardService.getOne.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.getOne(req, res);
        
                expect(cardService.getOne).toHaveBeenCalledWith(mockCard._id.toString());
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.params.cardId = 'invalidId';
    
            await cardController.getOne(req, res);
    
            expect(cardService.getOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {

            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
    
                cardService.getOne.mockRejectedValue(new Error('Test error'));
        
                await cardController.getOne(req, res);
        
                expect(cardService.getOne).toHaveBeenCalledWith(mockCard._id.toString());
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.params.cardId = undefined;
    
            await cardController.getOne(req, res);
    
            expect(cardService.getOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if cardId is not a string', async () => {
            req.params.cardId = 123456;
    
            await cardController.getOne(req, res);
    
            expect(cardService.getOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.params.cardId = '123';
    
            await cardController.getOne(req, res);
    
            expect(cardService.getOne).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('updateTrainingCardChecked', () => {
        it('should update a card checked field', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = true;
    
                cardService.updateTrainingCardChecked.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.updateTrainingCardChecked(req, res);
    
                expect(cardService.updateTrainingCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.body.cardId = 'invalidId';
            req.body.checked = true;
    
            await cardController.updateTrainingCardChecked(req, res);
    
            expect(cardService.updateTrainingCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = true;
    
                cardService.updateTrainingCardChecked.mockRejectedValue(new Error('Test error'));
    
                await cardController.updateTrainingCardChecked(req, res);
    
                expect(cardService.updateTrainingCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.body.cardId = undefined;
            req.body.checked = true;
    
            await cardController.updateTrainingCardChecked(req, res);
    
            expect(cardService.updateTrainingCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if checked field is not boolean', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = 'not_boolean';
        
                await cardController.updateTrainingCardChecked(req, res);
        
                expect(cardService.updateTrainingCardChecked).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "O campo checked precisa ser booleano"
                });
            }
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.body.cardId = '123';
            req.body.checked = true;
    
            await cardController.updateTrainingCardChecked(req, res);
    
            expect(cardService.updateTrainingCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('updateMealsCardChecked', () => {
        it('should update a meals card checked field', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = true;
    
                cardService.updateMealsCardChecked.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.updateMealsCardChecked(req, res);
    
                expect(cardService.updateMealsCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.body.cardId = 'invalidId';
            req.body.checked = true;
    
            await cardController.updateMealsCardChecked(req, res);
    
            expect(cardService.updateMealsCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = true;
    
                cardService.updateMealsCardChecked.mockRejectedValue(new Error('Test error'));
    
                await cardController.updateMealsCardChecked(req, res);
    
                expect(cardService.updateMealsCardChecked).toHaveBeenCalledWith(mockCard._id.toString(), true);
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.body.cardId = undefined;
            req.body.checked = true;
    
            await cardController.updateMealsCardChecked(req, res);
    
            expect(cardService.updateMealsCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if checked field is not boolean', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.checked = 'not_boolean';
        
                await cardController.updateMealsCardChecked(req, res);
        
                expect(cardService.updateMealsCardChecked).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "O campo checked precisa ser booleano"
                });
            }
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.body.cardId = '123';
            req.body.checked = true;
    
            await cardController.updateMealsCardChecked(req, res);
    
            expect(cardService.updateMealsCardChecked).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('addTask', () => {
        it('should add a task to a card', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = 'Test task';
    
                cardService.addTask.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.addTask(req, res);
    
                expect(cardService.addTask).toHaveBeenCalledWith(mockCard._id.toString(), { description: 'Test task' });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.params.cardId = 'invalidId';
            req.body.description = 'Test task';
    
            await cardController.addTask(req, res);
    
            expect(cardService.addTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = 'Test task';
    
                cardService.addTask.mockRejectedValue(new Error('Test error'));
    
                await cardController.addTask(req, res);
    
                expect(cardService.addTask).toHaveBeenCalledWith(mockCard._id.toString(), { description: 'Test task' });
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.params.cardId = undefined;
            req.body.description = 'Test task';
    
            await cardController.addTask(req, res);
    
            expect(cardService.addTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if task description is missing or empty', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = '';
        
                await cardController.addTask(req, res);
        
                expect(cardService.addTask).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "Descrição da tarefa inválida"
                });
            }
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.params.cardId = '123';
            req.body.description = 'Test task';
    
            await cardController.addTask(req, res);
    
            expect(cardService.addTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('addMeal', () => {
        it('should add a meal to a card', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = 'Test meal';
    
                cardService.addMeal.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.addMeal(req, res);
    
                expect(cardService.addMeal).toHaveBeenCalledWith(mockCard._id.toString(), { description: 'Test meal' });
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.params.cardId = 'invalidId';
            req.body.description = 'Test meal';
    
            await cardController.addMeal(req, res);
    
            expect(cardService.addMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = 'Test meal';
    
                cardService.addMeal.mockRejectedValue(new Error('Test error'));
    
                await cardController.addMeal(req, res);
    
                expect(cardService.addMeal).toHaveBeenCalledWith(mockCard._id.toString(), { description: 'Test meal' });
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.params.cardId = undefined;
            req.body.description = 'Test meal';
    
            await cardController.addMeal(req, res);
    
            expect(cardService.addMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if meal description is missing or empty', async () => {
            if (mockCard._id) {
                req.params.cardId = mockCard._id.toString();
                req.body.description = '';
        
                await cardController.addMeal(req, res);
        
                expect(cardService.addMeal).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "Descrição de refeição inválida"
                });
            }
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.params.cardId = '123';
            req.body.description = 'Test meal';
    
            await cardController.addMeal(req, res);
    
            expect(cardService.addMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('updateTitle', () => {
        it('should update a card title', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.title = 'Test title';
    
                cardService.updateTitle.mockResolvedValue({ error: false, statusCode: 200, card: mockCard });
    
                await cardController.updateTitle(req, res);
    
                expect(cardService.updateTitle).toHaveBeenCalledWith(mockCard._id.toString(), 'Test title');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "card": mockCard
                });
            }
        });
    
        it('should return error if cardId is invalid', async () => {
            req.body.cardId = 'invalidId';
            req.body.title = 'Test title';
    
            await cardController.updateTitle(req, res);
    
            expect(cardService.updateTitle).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.title = 'Test title';
    
                cardService.updateTitle.mockRejectedValue(new Error('Test error'));
    
                await cardController.updateTitle(req, res);
    
                expect(cardService.updateTitle).toHaveBeenCalledWith(mockCard._id.toString(), 'Test title');
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if cardId is missing', async () => {
            req.body.cardId = undefined;
            req.body.title = 'Test title';
    
            await cardController.updateTitle(req, res);
    
            expect(cardService.updateTitle).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    
        it('should return error if title is missing or empty', async () => {
            if (mockCard._id) {
                req.body.cardId = mockCard._id.toString();
                req.body.title = '';
        
                await cardController.updateTitle(req, res);
        
                expect(cardService.updateTitle).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "Título inválido"
                });
            }
        });
    
        it('should return error if cardId is a string, but not 24 characters hex string', async () => {
            req.body.cardId = '123';
            req.body.title = 'Test title';
    
            await cardController.updateTitle(req, res);
    
            expect(cardService.updateTitle).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID do card inválido"
            });
        });
    });

    describe('updateTask', () => {
        it('should update a task description', async () => {
            if (mockTask._id) {
                req.body.taskId = mockTask._id.toString();
                req.body.description = 'Test description';
    
                cardService.updateTask.mockResolvedValue({ error: false, statusCode: 200, task: mockTask });
    
                await cardController.updateTask(req, res);
    
                expect(cardService.updateTask).toHaveBeenCalledWith(mockTask._id.toString(), 'Test description');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "task": mockTask
                });
            }
        });
    
        it('should return error if taskId is invalid', async () => {
            req.body.taskId = 'invalidId';
            req.body.description = 'Test description';
    
            await cardController.updateTask(req, res);
    
            expect(cardService.updateTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockTask._id) {
                req.body.taskId = mockTask._id.toString();
                req.body.description = 'Test description';
    
                cardService.updateTask.mockRejectedValue(new Error('Test error'));
    
                await cardController.updateTask(req, res);
    
                expect(cardService.updateTask).toHaveBeenCalledWith(mockTask._id.toString(), 'Test description');
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if taskId is missing', async () => {
            req.body.taskId = undefined;
            req.body.description = 'Test description';
    
            await cardController.updateTask(req, res);
    
            expect(cardService.updateTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    
        it('should return error if description is missing or empty', async () => {
            if (mockTask._id) {
                req.body.taskId = mockTask._id.toString();
                req.body.description = '';
        
                await cardController.updateTask(req, res);
        
                expect(cardService.updateTask).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "Descrição da tarefa inválida"
                });
            }
        });
    
        it('should return error if taskId is a string, but not 24 characters hex string', async () => {
            req.body.taskId = '123';
            req.body.description = 'Test description';
    
            await cardController.updateTask(req, res);
    
            expect(cardService.updateTask).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    });

    describe('updateMeal', () => {
        it('should update a meal description', async () => {
            if (mockMeal._id) {
                req.body.mealId = mockMeal._id.toString();
                req.body.description = 'Test description';
    
                cardService.updateMeal.mockResolvedValue({ error: false, statusCode: 200, meal: mockMeal });
    
                await cardController.updateMeal(req, res);
    
                expect(cardService.updateMeal).toHaveBeenCalledWith(mockMeal._id.toString(), 'Test description');
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    "error": false,
                    "statusCode": 200,
                    "meal": mockMeal
                });
            }
        });
    
        it('should return error if mealId is invalid', async () => {
            req.body.mealId = 'invalidId';
            req.body.description = 'Test description';
    
            await cardController.updateMeal(req, res);
    
            expect(cardService.updateMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockMeal._id) {
                req.body.mealId = mockMeal._id.toString();
                req.body.description = 'Test description';
    
                cardService.updateMeal.mockRejectedValue(new Error('Test error'));
    
                await cardController.updateMeal(req, res);
    
                expect(cardService.updateMeal).toHaveBeenCalledWith(mockMeal._id.toString(), 'Test description');
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error',
                });
            }
        });
    
        it('should return error if mealId is missing', async () => {
            req.body.mealId = undefined;
            req.body.description = 'Test description';
    
            await cardController.updateMeal(req, res);
    
            expect(cardService.updateMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    
        it('should return error if description is missing or empty', async () => {
            if (mockMeal._id) {
                req.body.mealId = mockMeal._id.toString();
                req.body.description = '';
    
                await cardController.updateMeal(req, res);
    
                expect(cardService.updateMeal).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 400,
                    message: "Descrição da tarefa inválida"
                });
            }
        });
    
        it('should return error if mealId is a string, but not 24 characters hex string', async () => {
            req.body.mealId = '123';
            req.body.description = 'Test description';
    
            await cardController.updateMeal(req, res);
    
            expect(cardService.updateMeal).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 400,
                message: "ID da tarefa inválido"
            });
        });
    });

    describe('delTask', () => {
        it('should delete a task', async () => {
            if (mockTask._id) {
                req.params.taskId = mockTask._id.toString();
    
                cardService.delTask.mockResolvedValue({ error: false, statusCode: 200, message: 'Task deleted successfully' });
    
                await cardController.delTask(req, res);
    
                expect(cardService.delTask).toHaveBeenCalledWith(mockTask._id.toString());
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    error: false,
                    statusCode: 200,
                    message: 'Task deleted successfully'
                });
            }
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockTask._id) {
                req.params.taskId = mockTask._id.toString();
    
                cardService.delTask.mockRejectedValue(new Error('Test error'));
    
                await cardController.delTask(req, res);
    
                expect(cardService.delTask).toHaveBeenCalledWith(mockTask._id.toString());
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error'
                });
            }
        });
    });

    describe('delMeal', () => {
        it('should delete a meal', async () => {
            if (mockMeal._id) {
                req.params.mealId = mockMeal._id.toString();
    
                cardService.delMeal.mockResolvedValue({ error: false, statusCode: 200, message: 'Meal deleted successfully' });
    
                await cardController.delMeal(req, res);
    
                expect(cardService.delMeal).toHaveBeenCalledWith(mockMeal._id.toString());
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    error: false,
                    statusCode: 200,
                    message: 'Meal deleted successfully'
                });
            }
        });
    
        it('should return a server error if the service throws', async () => {
            if (mockMeal._id) {
                req.params.mealId = mockMeal._id.toString();
    
                cardService.delMeal.mockRejectedValue(new Error('Test error'));
    
                await cardController.delMeal(req, res);
    
                expect(cardService.delMeal).toHaveBeenCalledWith(mockMeal._id.toString());
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: true,
                    statusCode: 500,
                    message: 'Test error'
                });
            }
        });
    });
});