let express = require('express');
let app = express();
let port = 3000;
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, function() {
    console.log(`Your app is listening on ${port}!`);
});
