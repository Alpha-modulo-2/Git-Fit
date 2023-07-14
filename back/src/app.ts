import express from "express";
import { router } from "./router";
import cookieParser from "cookie-parser";
import cors from "cors";

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
    }

    private router() {
        this.server.use(router);
    }
}
