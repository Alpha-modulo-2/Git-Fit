import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error('REDIS_HOST ou REDIS_PORT não definidos');
}

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
});

interface ResponseWithOriginalSend extends Response {
    originalSend?: any;
}

export default async function cacheMiddleware(req: Request, res: ResponseWithOriginalSend, next: NextFunction) {
    const key = req.url;
    const cacheResult = await redis.get(key);

    if (cacheResult) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(JSON.parse(cacheResult));
    }

    res.originalSend = res.send;
    res.send = (body: any) => {
        redis.set(key, body, 'EX', 60 * 60);
        return res.originalSend(body);
    }
    next();
}