//Our app, express
import { app } from "../index"
import request from 'supertest'

const chai = require('chai');
const should = chai.should();

//body-parser for parsing req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

//describe() declares a test suite
describe('GET routes', () => {

    describe('index', () => {

        it('should be status 200', (done) => {
            request(app)
                .get('/')
                .end((err, res) => {
                    res.status.should.equal(404);
                    done(err);
                });
        });

    })

});