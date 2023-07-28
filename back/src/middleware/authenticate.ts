import { NextFunction, Request, Response } from "express";
import jwtLib from "jsonwebtoken";

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!process.env.JWTSECRET) {
            throw new Error('JWTSECRET nao definido');
        }

        jwtLib.verify(
            req.cookies["session"],
            process.env.JWTSECRET
        );
        next();

    } catch (error: any) {
        res.status(401).json({ errors: error.message });
    }
}
