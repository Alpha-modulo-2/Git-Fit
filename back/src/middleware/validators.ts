import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

const insertSchema = yup.object().shape({
    name: yup.string().matches(/^[a-zA-Zà-úÀ-Ú ]+$/, 'Nome inválido').required("O nome é obrigatório"),
    userName: yup.string().required("O username é obrigatório"),
    email: yup.string().email('Email inválido').required("O email é obrigatório"),
    password: yup.string().matches(/^\w{1,}$/gim, 'Senha inválida').min(5).required("A senha é obrigatória"),
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
    userName: yup.string().required("O username é obrigatório"),
    password: yup.string().matches(/^\w{1,}$/gim, 'Senha inválida').min(5).required("A senha é obrigatória"),
});

const idSchema = yup.object().shape({
    id: yup.string().required("O id é obrigatório").matches(/^[0-9a-fA-F]{24}$/, 'ID fornecido é inválido.'),
});

const querySchema = yup.object().shape({
    name: yup.string().required("O nome é obrigatório"),
});

const removeFriendSchema = yup.object().shape({
    userId: yup.string().required("O id do usuário é obrigatório"),
    friendId: yup.string().required("O id do amigo é obrigatório"),
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

export function validateId(req: Request, res: Response, next: NextFunction) {
    idSchema.validate(req.params)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}

export function validateQuery(req: Request, res: Response, next: NextFunction) {
    querySchema.validate(req.query)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}

export function validateRemoveFriend(req: Request, res: Response, next: NextFunction) {
    removeFriendSchema.validate(req.params)
        .then(() => next())
        .catch((err) => {
            res.status(400).json({
                error: true,
                statusCode: 400,
                message: err.message,
            });
        });
}