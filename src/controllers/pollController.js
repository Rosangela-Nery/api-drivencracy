import mongo from '../db/db.js';
import dayjs from 'dayjs';
import { status_code } from '../enums/status.js';
import { COLLECTIONS } from '../enums/collections.js';
import { surveySchema } from '../schemas/mySchemas.js';

async function pollPost(req, res) {

    const poll = req.body;
    
    const validation = surveySchema.validate(poll,{
        abortEarly: false,
    });
    
    if(validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        res.status(status_code.unprocessable_entity).send(errors);
        return;
    }

    let date = dayjs(poll.expireAt).format("YYYY-MM-DD HH:mm");

    if(poll.expireAt === '') {
        date = dayjs().add(30, 'day').format("YYYY-MM-DD HH:mm");
    }
    
    const objectPoll = {
        title: poll.title, 
        expireAt: date,
    };

    try {
        await mongo
            .collection(COLLECTIONS.poll)
            .insertOne(objectPoll);
    
        res.send(status_code.created);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function pollGet(req, res) {

    try {
        const polls = await mongo.collection(COLLECTIONS.poll).find().toArray();
    
        res.send(polls);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }

}

async function pollIdChoice(req, res) {
    try {
        const choices = await db.collection("choice").find({}).toArray();

        res.send(choices); //retornando minhas listas de opções de voto de uma enquete
    } catch (error) {
        res.status(500).send(error.message);
    };
}

export { pollPost, pollGet, pollIdChoice };