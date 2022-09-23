import mongo from '..db/db.js';
import joi from 'joi';
import dayjs from 'dayjs';

const surveySchema = joi.object({
    title: joi.string().min(3).required(),
    expireAt: joi.string(),
});

async function pollPost() {

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
        await mongo
            .collection("poll")
            .insertOne({
                title: poll.title, 
                expireAt: dayjs().format("YYYY-MM-DD HH:mm"),
            });
    
        res.send(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function pollGet() {

    try {
        const polls = await mongo.collection("poll").find().toArray();
    
        res.send(polls);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export { pollPost, pollGet };