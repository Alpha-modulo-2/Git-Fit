import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { connectToTestDatabase, closeDatabase, resetDatabase } from  '../database/mockDatabase'
import { router } from './router';
import { userModel } from '../models/user';
import { cardModel } from '../models/card';
import ICard from '../interfaces/ICard';
import cookieParser from 'cookie-parser';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import Redis from 'ioredis';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', router);

beforeAll(async () => {
    await connectToTestDatabase();
});

afterEach(async () => {
    await resetDatabase()
    jest.restoreAllMocks();
    const redis = new Redis();
    await redis.flushdb();
    redis.disconnect();
});

afterAll(async () => {
    await closeDatabase();
});

async function createLogin(username: string) {
    const response = await request(app)
    .post('/login')
    .send({
        userName: username,
        password: 'test12345'
    })
    return response.body; 
}

async function createUser(username: string) {
    const user = {
        name: `${username} Surname`,
        userName: username,
        password: 'test12345',
        email: `${username}user@example.com`,
        friends: [],
        photo: 'path-to-photo',
        gender: 'M',
        weight: '70kg',
        height: '175cm',
        occupation: 'Engineer',
        age: 30
    };

    const response = await request(app)
        .post('/users')
        .send(user);
    return response.body;
}


async function getCardsFromDatabase(userId: string): Promise<ICard[]> {
    try {
        const cards:ICard[] = await cardModel.find({ userId: userId });
        return cards;
    } catch (error: any) {
        throw new Error(`Failed to get cards from database: ${error.message}`);
    }
}

describe('POST /cards/:userId', () => {
    it('should insert cards for the user successfully', async () => {
        const passwordHash = await bcrypt.hash('test12345', 10);
        const testname = {
            name: `Test Surname`,
            userName: 'testname',
            password: passwordHash,
            email: `testnameuser@example.com`,
            friends: [],
            photo: 'path-to-photo',
            gender: 'M',
            weight: '70kg',
            height: '175cm',
            occupation: 'Engineer',
            age: 30
        };
    
        await userModel.create(testname)
        const { token, user } = await createLogin('testname');

        const response = await request(app)
            .post(`/cards/${user._id}`)
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(201);
        expect(response.body.error).toBe(false);
        
        const cards = await getCardsFromDatabase(user._id);
        expect(cards.length).toBe(7);
        expect(cards[0].name).toBe('Segunda-feira')
    });

    it('should fail if the userId is invalid (wrong size)', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
    
        const response = await request(app)
            .post('/cards/invalidUserId')
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("ID do usuário inválido");
    });

    it('should fail if the userId is invalid (wrong characters)', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
    
        const response = await request(app)
            .post('/cards/1234567890abcdefg12345z')
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("ID do usuário inválido");
    });

    it('should fail if the cards already exist for the user', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        
        await request(app)
            .post(`/cards/${user._id}`)
            .set('Cookie', `session=${token}`);
    
        const response = await request(app)
            .post(`/cards/${user._id}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Cards já existem para este usuário");
    });
});

describe('GET /allcards/:userId', () => {
    it('should get all cards for the user successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');

        const response = await request(app)
            .get(`/allcards/${user._id}`)
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card).toBeTruthy();
        expect(response.body.card.length).toBe(7);
        expect(response.body.card[0].name).toBe('Segunda-feira')
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        
        const response = await request(app).get(`/allcards/${user._id}`);
        
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt must be provided");
    });

    it('should return an error for an invalid user ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const response = await request(app)
            .get(`/allcards/invalid-user-id`)
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do usuário inválido');
    });

    it('should return an error if no cards found for the user', async () => {
        const passwordHash = await bcrypt.hash('test12345', 10);
        const testname = {
            name: `Test Surname`,
            userName: 'testname',
            password: passwordHash,
            email: `testnameuser@example.com`,
            friends: [],
            photo: 'path-to-photo',
            gender: 'M',
            weight: '70kg',
            height: '175cm',
            occupation: 'Engineer',
            age: 30
        };
    
        await userModel.create(testname)
        const { token, user } = await createLogin('testname');
    
        const response = await request(app)
            .get(`/allcards/${user._id}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Cards não encontrados.');
    });
});

describe('GET /card/:cardId', () => {
    it('should retrieve the card by ID successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        
        const allcards = await getCardsFromDatabase(user._id)
        const onecard = allcards[0]._id

        const response = await request(app)
            .get(`/card/${onecard}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(onecard?.toString());
        expect(response.body.card.userId).toBe(user._id);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        
        const allcards = await getCardsFromDatabase(user._id)
        const onecard = allcards[0]._id

        const response = await request(app)
            .get(`/card/${onecard}`)
            .set('Cookie', `session=${'invalid'}`);
        
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should fail to retrieve the card with an invalid ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        
        const response = await request(app)
            .get(`/card/invalid-card-id`)
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do card inválido');
    });

    it('should fail to retrieve a non-existent card', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const nonExistentCardId = '123456789012345678901234';
    
        const response = await request(app)
            .get(`/card/${nonExistentCardId}`)
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Card não encontrado.');
    });
})

describe('POST /card/:cardId/task', () => {
    it('should add a task to the card successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
    
        const allcardsbefore = await getCardsFromDatabase(user._id);
        const cardId = allcardsbefore[0]._id;
        const taskDescription = 'Nova tarefa de teste';
    
        const response = await request(app)
            .post(`/card/${cardId}/task`)
            .send({ description: taskDescription })
            .set('Cookie', `session=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(cardId?.toString());
        expect(response.body.card.trainingCard.tasks[0].description).toBe(taskDescription);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        
        const allcardsbefore = await getCardsFromDatabase(user._id);
        const cardId = allcardsbefore[0]._id;
        const taskDescription = 'Nova tarefa de teste';

        const response = await request(app)
            .post(`/card/${cardId}/task`)
            .send({ description: taskDescription })
            .set('Cookie', `session=${'token'}`);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error for invalid card ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const invalidCardId = '123';
    
        const response = await request(app)
            .post(`/card/${invalidCardId}/task`)
            .send({ description: 'Nova tarefa' })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do card inválido');
    });

    it('should return an error for invalid task description', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
    
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
    
        const response = await request(app)
            .post(`/card/${cardId}/task`)
            .send({ description: '' })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Descrição da tarefa inválida');
    });
})

describe('POST /card/:cardId/meal', () => {
    it('should add a meal to the card successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
    
        const allcardsbefore = await getCardsFromDatabase(user._id);
        const cardId = allcardsbefore[0]._id;
        const mealDescription = 'Nova refeição de teste';
    
        const response = await request(app)
            .post(`/card/${cardId}/meal`)
            .send({ description: mealDescription })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(cardId?.toString());
        expect(response.body.card.mealsCard.meals[0].description).toBe(mealDescription);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcardsbefore = await getCardsFromDatabase(user._id);
        const cardId = allcardsbefore[0]._id;
        const mealDescription = 'Nova refeição de teste';
    
        const response = await request(app)
            .post(`/card/${cardId}/meal`)
            .send({ description: mealDescription })
            .set('Cookie', `session=${'token'}`);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should fail with an invalid card ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealDescription = 'Nova refeição de teste';
    
        const response = await request(app)
            .post('/card/invalid_card_id/meal')
            .send({ description: mealDescription })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do card inválido');
    });

    it('should fail with an invalid meal description', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
    
        const response = await request(app)
            .post(`/card/${cardId}/meal`)
            .send({ description: '' }) 
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Descrição de refeição inválida');
    });
})

describe('POST /card/updateTitle', () => {
    it('should update the card title successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
    
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const newTitle = 'Novo Título de Teste';
    
        const response = await request(app)
            .patch('/card/updateTitle')
            .send({ cardId, title: newTitle })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(cardId?.toString());
        expect(response.body.card.trainingCard.title).toBe(newTitle);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const newTitle = 'Novo Título de Teste';
    
        const response = await request(app)
            .patch('/card/updateTitle')
            .send({ cardId, title: newTitle })
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error for invalid card ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        
        const response = await request(app)
            .patch('/card/updateTitle')
            .send({ cardId: 'invalidID', title: 'Novo Título' })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do card inválido');
    });

    it('should return an error for invalid title', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
    
        const response = await request(app)
            .patch('/card/updateTitle')
            .send({ cardId, title: '' })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Título inválido');
    });
})

describe('POST /trainingCard/check', () => {
    it('should update the checked field of the training card successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = true;
    
        const response = await request(app)
            .patch('/trainingCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(cardId?.toString());
        expect(response.body.card.trainingCard.checked).toBe(checked);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = true;
    
        const response = await request(app)
            .patch('/trainingCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${'token'}`);
        
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error for an invalid card ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const cardId = "invalid_id"; 
        const checked = true;
    
        const response = await request(app)
            .patch('/trainingCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe("ID do card inválido");
    });

    it('should return an error for non-boolean checked value', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = "non_boolean_value";
    
        const response = await request(app)
            .patch('/trainingCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe("O campo checked precisa ser booleano");
    });

    it('should return an error for a non-existing card', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const cardId = new mongoose.Types.ObjectId();
        const checked = true;
    
        const response = await request(app)
            .patch('/trainingCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
        
        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe("Card não encontrado.");
    });
})

describe('POST /mealsCard/check', () => {
    it('should update the checked status of the meals card successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = true;
    
        const response = await request(app)
            .patch('/mealsCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card._id).toBe(cardId?.toString());
        expect(response.body.card.mealsCard.checked).toBe(checked);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = true;
    
        const response = await request(app)
            .patch('/mealsCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error if the card ID is invalid', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const cardId = '123';
        const checked = true;
    
        const response = await request(app)
            .patch('/mealsCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID do card inválido');
    });

    it('should return an error if the checked value is not a boolean', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        const checked = 'notABoolean';
    
        const response = await request(app)
            .patch('/mealsCard/check')
            .send({ cardId, checked })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('O campo checked precisa ser booleano');
    });
})

describe('POST /updateTask', () => {
    it('should update the task description successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id
        const taskId = new mongoose.Types.ObjectId()

        const task = {
            _id: taskId,
            description: 'Velha descrição da tarefa'
        }
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "trainingCard.tasks": task } });
        
        const description = 'Nova descrição da tarefa';
    
        const response = await request(app)
            .patch('/updateTask')
            .send({ taskId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card.trainingCard.tasks[0].description).toBe(description);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id
        const taskId = new mongoose.Types.ObjectId()

        const task = {
            _id: taskId,
            description: 'Velha descrição da tarefa'
        }
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "trainingCard.tasks": task } });
        
        const description = 'Nova descrição da tarefa';
    
        const response = await request(app)
            .patch('/updateTask')
            .send({ taskId, description })
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should fail with an invalid task ID', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const taskId = 'invalid-task-id';
        const description = 'Nova descrição da tarefa';
    
        const response = await request(app)
            .patch('/updateTask')
            .send({ taskId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe("ID da tarefa inválido");
    });

    it('should fail with an invalid task description', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste')
        const taskId = new mongoose.Types.ObjectId()
        const description = ''; 
    
        const response = await request(app)
            .patch('/updateTask')
            .send({ taskId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe("Descrição da tarefa inválida");
    });
})

describe('POST /updateMeal', () => {
    it('should update the meal description successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id
        const mealId = new mongoose.Types.ObjectId();
    
        const meal = {
            _id: mealId,
            description: 'Velha descrição da refeição'
        }
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "mealsCard.meals": meal } });
        
        const description = 'Nova descrição da refeição';
    
        const response = await request(app)
            .patch('/updateMeal')
            .send({ mealId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.card.mealsCard.meals[0].description).toBe(description);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id
        const mealId = new mongoose.Types.ObjectId();
    
        const meal = {
            _id: mealId,
            description: 'Velha descrição da refeição'
        }
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "mealsCard.meals": meal } });
        
        const description = 'Nova descrição da refeição';
    
        const response = await request(app)
            .patch('/updateMeal')
            .send({ mealId, description })
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error for an invalid mealId', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealId = 'invalid-mealId';
        const description = 'Nova descrição da refeição';
    
        const response = await request(app)
            .patch('/updateMeal')
            .send({ mealId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID da tarefa inválido');
    });

    it('should return an error for an invalid description', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealId = new mongoose.Types.ObjectId().toString();
    
        const response = await request(app)
            .patch('/updateMeal')
            .send({ mealId, description: '   ' })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Descrição da tarefa inválida');
    });

    it('should return an error if meal not found', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealId = new mongoose.Types.ObjectId().toString()
        const description = 'Nova descrição da refeição';
    
        const response = await request(app)
            .patch('/updateMeal')
            .send({ mealId, description })
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Refeição não encontrada.');
    });
})

describe('DELETE /delTask', () => {
    it('should delete the task successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        
        const taskId = new mongoose.Types.ObjectId();
        const task = { _id: taskId, description: 'Descrição da tarefa' };
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "trainingCard.tasks": task } });
        
        const response = await request(app)
            .delete(`/task/${taskId}`)
            .set('Cookie', `session=${token}`);

        const updatedCard = await cardModel.findById(cardId);

        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.message).toBe('Task deletada.');
        expect(updatedCard?.trainingCard.tasks).toEqual([]);
    })

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
        
        const taskId = new mongoose.Types.ObjectId();
        const task = { _id: taskId, description: 'Descrição da tarefa' };
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "trainingCard.tasks": task } });
        
        const response = await request(app)
            .delete(`/task/${taskId}`)
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error when taskId is invalid', async () => {
        await createUser('usuarioteste');
        const taskId = 'invalidTaskId';
        const { token } = await createLogin('usuarioteste');
    
        const response = await request(app)
            .delete(`/task/${taskId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID da tarefa inválido');
    });
})

describe('DELETE /delMeal', () => {
    it('should delete the meal successfully', async () => {
        await createUser('usuarioteste');
        const { token, user } = await createLogin('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
    
        const mealId = new mongoose.Types.ObjectId();
        const meal = { _id: mealId, description: 'Descrição da tarefa' };
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "mealsCard.meals": meal } });
    
        const response = await request(app)
            .delete(`/meal/${mealId}`)
            .set('Cookie', `session=${token}`);

            const updatedCard = await cardModel.findById(cardId);
    
        expect(response.status).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.message).toBe('Refeição deletada.');
        expect(updatedCard?.mealsCard.meals).toEqual([]);
    });

    it('should return an error when not authenticated', async () => {
        const user = await createUser('usuarioteste');
        const allcards = await getCardsFromDatabase(user._id);
        const cardId = allcards[0]._id;
    
        const mealId = new mongoose.Types.ObjectId();
        const meal = { _id: mealId, description: 'Descrição da tarefa' };
        await cardModel.findByIdAndUpdate(
            cardId, { $push: { "mealsCard.meals": meal } });
    
        const response = await request(app)
            .delete(`/meal/${mealId}`)
            .set('Cookie', `session=${'token'}`);
    
        expect(response.status).toBe(401);
        expect(response.body.errors).toBe("jwt malformed");
    });

    it('should return an error for invalid mealId', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealId = 'invalid-meal-id';
    
        const response = await request(app)
            .delete(`/meal/${mealId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('ID da tarefa inválido');
    });

    it('should return an error for non-existing meal', async () => {
        await createUser('usuarioteste');
        const { token } = await createLogin('usuarioteste');
        const mealId = new mongoose.Types.ObjectId();
    
        const response = await request(app)
            .delete(`/meal/${mealId}`)
            .set('Cookie', `session=${token}`);
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Refeição não encontrada.');
    });
})
