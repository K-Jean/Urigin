import express from "express";
import bodyParser from "body-parser";
import user from "./routes/users";
import type from "./routes/types";
import game from "./routes/games";

export const app = express();
let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/v1/users', user);
app.use('/v1/types', type);
app.use('/v1/games', game);

app.listen(port, function () {
    console.log(`Your app is listening on ${port}!`);
});