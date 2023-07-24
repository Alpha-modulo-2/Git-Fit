import { NextFunction, Request, Response } from "express";
import jwtLib from "jsonwebtoken";

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        jwtLib.verify(
            req.cookies["session"],
            process.env.JWTSECRET
        );
        next();
    } catch (error: any) {
        res.status(401).redirect("/");
    }
}
