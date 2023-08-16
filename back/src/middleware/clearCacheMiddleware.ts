import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
});

async function clearCacheKeysWithPattern(pattern: string) {
    let cursor = '0';
    const keysToDelete = [];

    do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern);
        cursor = nextCursor;

        keysToDelete.push(...keys);

    } while (cursor !== '0');

    if (keysToDelete.length) {
        await redis.del(...keysToDelete);
    }
}

export async function clearCache(req: Request, res: Response, next: NextFunction) {
    console.log('Inside clearCache middleware');
    const patterns = [
        `/users/search?name=*`,
        `/users/*`,
        "/users"
    ];

    for (let pattern of patterns) {
        await clearCacheKeysWithPattern(pattern);
    }

    next();
}

export async function clearCacheForCards(req: Request, res: Response, next: NextFunction) {
    const patterns = [
        `/allcards/*`
    ];

    for (let pattern of patterns) {
        await clearCacheKeysWithPattern(pattern);
    }

    next();
}