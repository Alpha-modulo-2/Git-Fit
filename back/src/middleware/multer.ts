// import * as path from 'path';
import * as multer from 'multer';
import { Request } from 'express';

const storageConfig = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {

        callback(null, "./uploads");
    },
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
        const fileName = file.originalname;
        callback(null, fileName);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/pjpeg',
        'image/png',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    }
};

export default {
    dest: "./uploads",
    storage: storageConfig,
    fileFilter: fileFilter,
};