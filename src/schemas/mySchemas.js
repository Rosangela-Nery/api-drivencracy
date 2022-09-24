import joi from 'joi';

const surveySchema = joi.object({
    title: joi.string().min(3).required(),
    expireAt: joi.string().min(0),
});

const votingOptionsSchema = joi.object({
    title: joi.string().min(1).required(),
    pollId: joi.string().required()
});

const formatOfAVoteSchema = joi.object({
    createdAt: joi.number().required(),
    choiceID: joi.number().required()
});

export {
    surveySchema,
    votingOptionsSchema,
    formatOfAVoteSchema,
};