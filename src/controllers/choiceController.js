import { status_code } from '../enums/status.js';
import { COLLECTIONS } from '../enums/collections.js';
import { votingOptionsSchema } from '../schemas/mySchemas.js'
import db from '../db/db.js';

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

        const choiceExists = await db
            .collection(COLLECTIONS.choice)
            .find({ title: title }).count();

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