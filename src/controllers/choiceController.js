async function choicePost (req, res) {
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

};

export { choicePost };