import mongo from '../db/db.js';
import dayjs from 'dayjs';
import { status_code } from '../enums/status.js';
import { COLLECTIONS } from '../enums/collections.js';
import { surveySchema } from '../schemas/mySchemas.js';

async function pollPost() {

    const poll = req.body;
    
    const validation = surveySchema.validate(poll,{
        abortEarly: false,
    });
    
    if(validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        res.status(status_code.unprocessable_entity).send(errors);
        return;
    }
    
    try {
        await mongo
            .collection(COLLECTIONS.poll)
            .insertOne({
                title: poll.title, 
                expireAt: dayjs().format("YYYY-MM-DD HH:mm"),
            });
    
        res.send(status_code.created);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

async function pollGet() {

    try {
        const polls = await mongo.collection(COLLECTIONS.poll).find().toArray();
    
        res.send(polls);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }

}

export { pollPost, pollGet };