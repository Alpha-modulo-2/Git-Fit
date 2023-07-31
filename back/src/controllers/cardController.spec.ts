import CardController from '../controllers/CardController';
import ICard from '../interfaces/ICard';
import CardService from '../services/CardServices';
import { Types  } from 'mongoose';

interface MockCardService extends CardService {
    insert: jest.Mock;
    getAllCardsByUser: jest.Mock;
    getOne: jest.Mock;
}

const INVALID_USER_ID_MESSAGE = "ID do usuário inválido";

describe('CardController', () => {
    let req: any, res: any;
    let cardController: any;
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
            expect(res.json).toHaveBeenCalledWith(mockCard);
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
            expect(res.json).toHaveBeenCalledWith(cards);
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
            expect(res.json).toHaveBeenCalledWith("Card não encontrado");
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
                expect(res.json).toHaveBeenCalledWith(mockCard);
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
});