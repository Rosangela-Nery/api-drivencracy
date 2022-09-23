import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const { MONGODB_URI } = process.env

let db;
const mongoClient = new MongoClient(MONGODB_URI);


try {
    await mongoClient.connect();
} catch (error) {
    console.log(error);
}

db = mongoClient.db("drivencracy");

export default db;