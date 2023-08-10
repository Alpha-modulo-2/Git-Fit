import express from "express";
import { router } from "./routes/router";
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
        this.server.use(cookieParser());
        this.server.use(cors({ origin: "http://localhost:3000", credentials: true }));
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(express.json());
        this.server.use(express.static(path.join(__dirname, 'public')));
    }

    private router() {
        this.server.use(router);
    }
}
