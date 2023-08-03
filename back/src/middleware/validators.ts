import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

const insertSchema = yup.object().shape({
    name: yup.string().matches(/^[a-zA-Zà-úÀ-Ú ]+$/, 'Nome inválido').required(),
    userName: yup.string().required(),
    email: yup.string().email('Email inválido').required(),
    password: yup.string().matches(/^\w{1,}$/gim, 'Senha inválida').min(5).required(),
    gender: yup.string().matches(/^[MFO]$/, 'Gênero inválido').notRequired(),
    weight: yup.string().matches(/^\d{1,3}kg$/, 'Peso inválido').notRequired(),
    height: yup.string().matches(/^\d{1,3}cm$/, 'Altura inválida').notRequired(),
    occupation: yup.string().matches(/^[a-zA-Z -]*$/, 'Ocupação inválida').notRequired(),
    age: yup.number().min(0, 'Idade inválida').notRequired(),
});

const updateSchema = yup.object().shape({
    name: yup.string().matches(/^[a-zA-Zà-úÀ-Ú ]+$/, 'Nome inválido').notRequired(),
    userName: yup.string().notRequired(),
    email: yup.string().email('Email inválido').notRequired(),
    password: yup.string().matches(/^\w{1,}$/gim, 'Senha inválida').min(5).notRequired(),
    gender: yup.string().matches(/^[MFO]$/, 'Gênero inválido').notRequired(),
    weight: yup.string().matches(/^\d{1,3}kg$/, 'Peso inválido').notRequired(),
    height: yup.string().matches(/^\d{1,3}cm$/, 'Altura inválida').notRequired(),
    occupation: yup.string().matches(/^[a-zA-Z -]*$/, 'Ocupação inválida').notRequired(),
    age: yup.number().min(0, 'Idade inválida').notRequired(),
});

const loginSchema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().matches(/^\w{1,}$/gim, 'Senha inválida').min(5).required(),
});

export function validateInsert(req: Request, res: Response, next: NextFunction) {
    insertSchema.validate(req.body)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
    loginSchema.validate(req.body)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}

export function validateUpdate(req: Request, res: Response, next: NextFunction) {
    updateSchema.validate(req.body)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}