import express from "express";
import { router } from "./router";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

export class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }
    

    private middleware() {
        const corsOptions = {
            origin: 'https://127.0.0.1:5173', // Defina a origem permitida, substitua pelo domínio real do seu aplicativo frontend
            credentials: true, // Permite o uso de credenciais (por exemplo, cookies, headers de autorização)
          };

        this.server.use(cookieParser());
        this.server.use(cors(corsOptions));
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(express.json());
        this.server.use(express.static(path.join(__dirname, 'public')));

    }

    private router() {
        this.server.use(router);
    }
}
