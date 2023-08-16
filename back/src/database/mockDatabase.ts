import { MongoMemoryServer } from 'mongodb-memory-server';
const mongoose = require("mongoose");

const mongod = new MongoMemoryServer();

export async function connectToTestDatabase() {
    await mongod.start();

    const uri = await mongod.getUri();

    await mongoose.connect(uri, { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
    console.log(`Connected to mock database`);
}

export async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

export async  function resetDatabase() {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany();
    }
}