let express = require('express');
export const app = express();
let port = 3000;
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export const server = app.listen(port, function() {
    console.log(`Your app is listening on ${port}!`);
});
