//Our app, express
import {app, server} from "../index"
import request from 'supertest'
import {models} from "../models"

const chai = require('chai');
const should = chai.should();

//body-parser for parsing req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

//describe() declares a test suite
describe('GET routes', () => {

    describe('index', function() {
        this.timeout(60000);

        before((done) => {
            models.users.create({"username": "toto", "email": "toto@toto.fr"}).then(value => {
                done();
            });
        });

        it('should be status 200', (done) => {
            request(app)
                .get('/v1/users')
                .end((err, res) => {
                    if (err) done(err);
                    res.status.should.equal(200);
                    done();
                });
        });
    });
});