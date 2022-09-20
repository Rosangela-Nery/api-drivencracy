import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import joi from "joi";
import dayjs from 'dayjs';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Conexão com o meu banco de dados:
const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("drivencracy");
});

// Validação de dados com o joi:
const surveySchema = joi.object({
    title: joi.string().min(3).required(),
    expireAt: joi.number().required()
});

const votingOptionsSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.number().required()
});

const formatOfAVoteSchema = joi.object({
    createdAt: joi.number().required(),
    choiceID: joi.number().required()
});

app.listen(5000, () => console.log("App rummin in port 5000"));