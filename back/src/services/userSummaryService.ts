import IResult from "../interfaces/IResult";
import UserSummaryRepository from "../repositories/userSummaryRepository";

export default class UserSummaryService {
    private repository: UserSummaryRepository;

    constructor(repository: UserSummaryRepository = new UserSummaryRepository()) {
        this.repository = repository;
    }

    async getOne(id: string): Promise<IResult> {
        try {

            const result = await this.repository.getOne(id);

            if (result.error) {
                const error = {
                    message: result.message,
                    code: result.statusCode
                }
                throw error
            }

            return result
        } catch (error: any) {
            return {
                error: true,
                message: error.message,
                statusCode: error.code || 500
            };
        }
    }
}
