import UserSummaryRepository, { summaryCronJob } from './userSummaryRepository';
import { userSummaryModel } from '../models/userSummary';

describe('UserSummaryRepository', () => {
    afterAll(async () => {
        summaryCronJob.stop()
    });

    describe('getOne', () => {
        it('should return a user summary if one exists', async () => {
            const mockSummary = {
                user: "123",
                weight: 90,
                checks: {
                    trainingCard: 5,
                    mealsCard: 5,
                },
            };

            userSummaryModel.findById = jest.fn().mockResolvedValue(mockSummary);

            const repo = new UserSummaryRepository();
            const result = await repo.getOne("123");

            expect(result).toEqual({
                error: false,
                statusCode: 200,
                userSummary: mockSummary,
            });
        });

        it('should throw an error if no user summary exists for the given ID', async () => {
            userSummaryModel.findById = jest.fn().mockResolvedValue(null);

            const repo = new UserSummaryRepository();
            const result = await repo.getOne("123");

            expect(result).toEqual({
                error: true,
                statusCode: 500,
                message: "histórico do Usuário não encontrado"
            });
        });

        it('should handle any other error that might occur during the process', async () => {
            userSummaryModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

            const repo = new UserSummaryRepository();
            const result = await repo.getOne("123");

            expect(result).toEqual({
                error: true,
                message: "Database error",
                statusCode: 500,
            });
        });
    });


});

