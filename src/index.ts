import express from "express";
import bodyParser from "body-parser";
import * as user from "./routes/users";

export const app = express();
let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/v1/users', user);

app.listen(port, function () {
    console.log(`Your app is listening on ${port}!`);
});