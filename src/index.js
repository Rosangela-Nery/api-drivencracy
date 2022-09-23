import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import joi from "joi";
import { pollPost, pollGet } from './controllers/pollController.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Validação de dados com o joi:

const votingOptionsSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.string().required()
});

const formatOfAVoteSchema = joi.object({
    createdAt: joi.number().required(),
    choiceID: joi.number().required()
});

// Rotas Poll
app.post("/poll", pollPost);
app.get("/poll", pollGet);

// Rotas choice
app.post("/choice", async (req, res) => {
    const { title, pollId } = req.body;
    
    try {
        const choice = {
            title: title,
            pollId: pollId,
        }
        
        const validation = votingOptionsSchema.validate(choice, {abortEarly: false});
        
        if(validation.error) {
            res.status(422).send(error);
            return;
        }

        const choiceExists = await db
            .collection("choice")
            .find({ title: title }).count();

        if(choiceExists) {
            res.send(409);
            return;
        }

        await db.collection("choice").insertOne(choice);

        res.send(201);
    } catch (error) {
        res.status(500).send(error.message);
    }

});

app.get("/choice", async (req, res) => {
    try {
        const choices = await db.collection("choice").find({}).toArray();

        res.send(choices); //retornando minhas listas de opções de voto de uma enquete
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/choice/:id/vote", async (req, res) => {
    
});

app.listen(process.env.PORT_API, () => {    
    console.log(`App rummin in port ${process.env.PORT_API}`)
});