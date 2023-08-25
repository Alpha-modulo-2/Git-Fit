import mongoose from 'mongoose';
import UserSummaryController from '../controllers/userSummaryController';
import UserSummaryService from '../services/userSummaryService';
import { summaryCronJob } from "../repositories/userSummaryRepository";
import { Types } from 'mongoose';

interface MockUserSummaryService extends UserSummaryService {
    getOne: jest.Mock;
}

describe('UserSummaryController', () => {
    let req: any, res: any;
    let userSummaryController: any;
    let userSummaryService: MockUserSummaryService;

    const mockUserId = new mongoose.Types.ObjectId().toString();

    const mockUserSummary = {
        user: new Types.ObjectId().toString(),
        weight: "70kg",
        date: new Date(),
        checks: {
            trainingCard: 5,
            mealsCard: 3,
        },
    };

    beforeEach(() => {
        req = {
            params: { userId: mockUserId }
        };
        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };

        userSummaryService = {
            getOne: jest.fn(),
        } as MockUserSummaryService;

        userSummaryController = new UserSummaryController(userSummaryService);
    });

    afterAll(async () => {
        summaryCronJob.stop()
    });

    it('should get one user summary', async () => {
        userSummaryService.getOne.mockResolvedValue({ error: false, statusCode: 200, user: mockUserSummary });

        await userSummaryController.getOne(req, res);

        expect(userSummaryService.getOne).toHaveBeenCalledWith(mockUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            "error": false,
            "statusCode": 200,
            "user": mockUserSummary
        });
    });

    it('should respond with error message when service returns error', async () => {
        const errorMessage = 'User Summary not found';
        userSummaryService.getOne.mockResolvedValue({ error: true, statusCode: 404, message: errorMessage });

        await userSummaryController.getOne(req, res);

        expect(userSummaryService.getOne).toHaveBeenCalledWith(mockUserId);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(errorMessage);
    });

    it('should respond with a 500 status when an exception occurs', async () => {
        const error = new Error('Unexpected error');
        userSummaryService.getOne.mockRejectedValue(error);

        await userSummaryController.getOne(req, res);

        expect(userSummaryService.getOne).toHaveBeenCalledWith(mockUserId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            statusCode: 500,
            message: `Erro ao buscar user Summary: ${error.message}`
        });
    });
});