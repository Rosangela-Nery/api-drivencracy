import express from 'express';
import { pollPost, pollGet } from '../controllers/pollController.js';

const router = express.Router();

router.post("/poll", pollPost);
router.get("/poll", pollGet);


export default router;