let express = require('express');
export const app = express();
let port = 3000;
let bodyParser = require('body-parser');
let user = require('./routes/users');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/v1/users', user);

export const server = app.listen(port, function() {
    console.log(`Your app is listening on ${port}!`);
});
