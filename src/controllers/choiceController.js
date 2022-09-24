import { status_code } from '../enums/status.js';
import { COLLECTIONS } from '../enums/collections.js';
import { votingOptionsSchema } from '../schemas/mySchemas.js'
import db from '../db/db.js';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

async function choicePost (req, res) {
    const { title, pollId } = req.body;
    
    try {
        const choice = {
            title: title,
            pollId: pollId,
        }
        
        const validation = votingOptionsSchema.validate(choice, {abortEarly: false});
        
        if(validation.error) {
            res.status(status_code.unprocessable_entity).send(error);
            return;
        }

        const existsPoll = await db.collection(COLLECTIONS.poll).find({_id: ObjectId(pollId)}).toArray();

        if(!existsPoll.length) {
            res.status(status_code.not_found).send({"message": "Essa enquete não existe!"});
            return;
        }

        const datePoll = dayjs(existsPoll[0].expireAt).format("YYYY-MM-DD HH:mm");

        if(datePoll < dayjs().format("YYYY-MM-DD HH:mm")) {
            res.status(status_code.forbidden).send({"message": "Enquete expirado!"});
            return;
        }

        const choiceExists = await db
            .collection(COLLECTIONS.choice)
            .find({ title: title, pollId: pollId }).count();

        if(choiceExists) {
            res.send(status_code.conflict);
            return;
        }

        await db.collection(COLLECTIONS.choice).insertOne(choice);

        res.send(status_code.created);
    } catch (error) {
        res.status(status_code.server_error).send(error.message);
    }

};

export { choicePost };