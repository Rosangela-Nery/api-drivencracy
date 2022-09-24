import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/pollroute.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(pollRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => {    
    console.log(`Server open in:(http://localhost:${PORT})`)
});
