import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/pollroute.js'

const app = express();

app.use(cors());
app.use(express.json());

// Validação de dados com o joi:

// Rotas Poll
app.use(pollRoutes);

app.get("/choice", async (req, res) => {
    try {
        const choices = await db.collection("choice").find({}).toArray();

        res.send(choices); //retornando minhas listas de opções de voto de uma enquete
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// app.post("/choice/:id/vote", async (req, res) => {
    
// });

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {    
    console.log(`Server open in:(http://localhost:${PORT})`)
});
