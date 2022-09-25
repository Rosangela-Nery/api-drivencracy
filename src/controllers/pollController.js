import mongo from '../db/db.js';
import dayjs from 'dayjs';
import { status_code } from '../enums/status.js';
import { COLLECTIONS } from '../enums/collections.js';
import { surveySchema } from '../schemas/mySchemas.js';
import { ObjectId } from 'mongodb';

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
    const { id } = req.params;

    const existPoll = await mongo.collection(COLLECTIONS.poll).find({_id: ObjectId(id)}).count();

    if(!existPoll) {
        res.status(status_code.not_found).send({"message": "Essa enquete não existe!"});
        return;
    }

    try {
        const choices = await mongo.collection(COLLECTIONS.choice).find({pollId: id}).toArray();

        res.send(choices); 
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    };
}

async function resultGet(req, res) {
    const { id } = req.params;

    try {

        const resultsExists = await mongo.collection(COLLECTIONS.poll).findOne({_id: ObjectId(id)});

        if(!resultsExists) {
            res.status(status_code.not_found).send({"message": "Essa enquete não existe!"});
            return;
        }

        const checkingAnswer = await mongo.collection(COLLECTIONS.choice).find({pollId: id}).toArray();

        let winner = {
            title: '',
            votes: 0
        }

        await Promise.all(checkingAnswer.map(async (answer) => {
            const votes = await mongo.collection(COLLECTIONS.vote).find({choiceId: answer._id.toString()}).count()

            if(votes > winner.votes) {
                winner.title = answer.title,
                winner.votes = votes
            }
        }))

        resultsExists.result = {...winner}

        res.status(status_code.created).send(resultsExists)

    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }
}

export { pollPost, pollGet, pollIdChoice, resultGet };