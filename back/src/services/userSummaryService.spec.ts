import cron from 'node-cron';
import UserSummaryService from './userSummaryService';
import UserSummaryRepository, { summaryCronJob } from '../repositories/userSummaryRepository';
import { Types } from 'mongoose';

jest.mock('../repositories/userSummaryRepository');

jest.mock('node-cron', () => ({
    schedule: jest.fn((timing, callback, options) => ({
        start: jest.fn(),
        stop: jest.fn(),
    })),
}));

describe('UserSummaryService', () => {
    let userSummaryService: UserSummaryService;
    let userSummaryRepository: jest.Mocked<UserSummaryRepository>;
    const mockId = new Types.ObjectId().toString();

    beforeEach(() => {
        userSummaryRepository = new UserSummaryRepository() as jest.Mocked<UserSummaryRepository>;
        userSummaryService = new UserSummaryService(userSummaryRepository);
    });

    afterAll(async () => {
        summaryCronJob.stop()
    });

    it('should return a user summary for a valid ID', async () => {
        const mockResponse = {
            error: false,
            userSummary: {
                user: mockId,
                weight: "70kg",
                date: new Date(),
                checks: {
                    trainingCard: 5,
                    mealsCard: 3,
                },
            },
            statusCode: 200
        };

        userSummaryRepository.getOne.mockResolvedValue(mockResponse);

        const result = await userSummaryService.getOne(mockId);

        expect(result).toEqual(mockResponse);
        expect(userSummaryRepository.getOne).toHaveBeenCalledWith(mockId);
    });

    it('should return an error if the repository returns an error', async () => {
        const mockError = {
            error: true,
            message: "User not found",
            statusCode: 404
        };

        userSummaryRepository.getOne.mockResolvedValue(mockError);

        const result = await userSummaryService.getOne(mockId);

        expect(result).toEqual({
            error: true,
            message: mockError.message,
            statusCode: mockError.statusCode
        });
        expect(userSummaryRepository.getOne).toHaveBeenCalledWith(mockId);
    });

    it('should return a general error if an unexpected exception is thrown', async () => {
        userSummaryRepository.getOne.mockRejectedValue(new Error("Unexpected error"));

        const result = await userSummaryService.getOne(mockId);

        expect(result).toEqual({
            error: true,
            message: "Unexpected error",
            statusCode: 500
        });
        expect(userSummaryRepository.getOne).toHaveBeenCalledWith(mockId);
    });

});