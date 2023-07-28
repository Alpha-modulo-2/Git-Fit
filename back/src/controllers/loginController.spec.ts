import LoginController from '../controllers/loginController';
import ILogin from '../interfaces/ILogin';
import LoginService from '../services/loginService';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

interface MockLoginService extends LoginService {
    login: jest.Mock;
}

describe('LoginController', () => {
    let req: any, res: any;
    let loginController: any;
    let loginService: MockLoginService;

    const mockCredentials: ILogin = {
        userName: "test",
        password: "password"
    };

    beforeEach(() => {
        req = { body: { username: mockCredentials.userName, password: mockCredentials.password } };
        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
            cookie: jest.fn(() => res),
        };

        loginService = {
            login: jest.fn(),
        } as MockLoginService;

        loginController = new LoginController(loginService);

        jwt.sign = jest.fn().mockReturnValue('token');
        process.env.JWTSECRET = 'secret';
    });

    it('should login a user', async () => {
        loginService.login.mockResolvedValue({ error: false, statusCode: 200, user: { userName: 'test' } });

        await loginController.login(req, res);

        expect(loginService.login).toHaveBeenCalledWith(mockCredentials);
        expect(jwt.sign).toHaveBeenCalledWith({ user: { userName: 'test' } }, process.env.JWTSECRET);
        expect(res.cookie).toHaveBeenCalledWith('session', 'token');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuário 'test' logado com sucesso." });
    });

    it('should fail to login when service throws an error', async () => {
        loginService.login.mockRejectedValue(new Error('login failed'));

        await loginController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "login failed" });
    });
});