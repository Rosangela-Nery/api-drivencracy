import { MongoClient } from 'mongodb';

let db;

const mongoClient = new MongoClient(process.env.MONGO_URI);


try {
    await mongoClient.connect();
} catch (error) {
    console.log(error);
}

db = mongoClient.db("drivencracy");

export default db;