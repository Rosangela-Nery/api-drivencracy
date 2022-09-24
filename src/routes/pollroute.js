import express from 'express';
import { pollPost, pollGet, pollIdChoice } from '../controllers/pollController.js';
import { choicePost } from '../controllers/choiceController.js'

const router = express.Router();

router.post("/poll", pollPost);
router.get("/poll", pollGet);
router.post("/choice", choicePost);
router.get("/poll/:id/choice", pollIdChoice);


export default router;