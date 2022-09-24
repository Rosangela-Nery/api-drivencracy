import express from 'express';
import { pollPost, pollGet, pollIdChoice, resultGet } from '../controllers/pollController.js';
import { choicePost, votePost } from '../controllers/choiceController.js'

const router = express.Router();

router.post("/poll", pollPost);
router.get("/poll", pollGet);
router.post("/choice", choicePost);
router.get("/poll/:id/choice", pollIdChoice);
router.post("/choice/:id/vote", votePost);
router.get("/poll/:id/result", resultGet);


export default router;