// External Dependencies
// import * as mongoDB from "mongodb";

const mongoose = require("mongoose")

export async function connectToDatabase() {
    await mongoose.connect(process.env.DB_CONN_STRING)
    console.log(`Successfully connected to database`);
}