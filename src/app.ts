import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import express from "express";
import cors from "cors";
import mongoDb from "./db/db";
import PollRoute from "./routes/PollRoute";
import AuthRoute from "./routes/AuthRoute";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.use('/auth', AuthRoute);
app.use('/poll', PollRoute);
app.use('*', (req, res) => {
    res.send({error: true, errorMessage: 'This endpoint does not exists'});
})

app.listen(port, async () => {
    console.log(`Express is listening at http://localhost:${port}`);
    await mongoDb();
});