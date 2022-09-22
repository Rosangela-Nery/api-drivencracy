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
    expireAt: joi.string(),
});

const votingOptionsSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.number().required()
});

const formatOfAVoteSchema = joi.object({
    createdAt: joi.number().required(),
    choiceID: joi.number().required()
});

// Rotas Poll
app.post("/poll", async (req, res) => {
    const poll = req.body;

    const validation = surveySchema.validate(poll,{
        abortEarly: false,
    });

    if(validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        res.status(422).send(errors);
        return;
    }

    try {
        await db
            .collection("poll")
            .insertOne({
                title: poll.title, 
                expireAt: dayjs().format("YYYY-MM-DD HH:mm"),
            });

        res.send(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/poll", async (req, res) => {
    try {
        const polls = await db.collection("poll").find().toArray();
        if(!polls) {
            res.status(404).send({"message": "Nenhuma enquete foi cadastrada!"});
        }

        res.send(polls);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(5000, () => console.log("App rummin in port 5000"));