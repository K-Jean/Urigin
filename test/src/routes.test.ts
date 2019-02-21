//Our app, express
import {app} from "../../src"
import request from 'supertest'
import {models} from "../../src/models"
import {createUserAndGetToken} from "./common";

const chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');
chai.use(chaiJsonEqual);
const should = chai.should();

//body-parser for parsing req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

//describe() declares a test suite
describe('Users Test case', function() {
    this.timeout(60000);

    before(async () => {
        await models.sequelize.sync({
            force: true
        });
    });

    describe('GET users', function() {
        this.timeout(60000);
        let tokens;

        before(async () => {
            tokens = await createUserAndGetToken(app, request);
        });

        it('should return one user', (done) => {
            request(app)
                .get('/v1/users')
                .set('Authorization', 'Bearer ' + tokens)
                .end((err, res) => {
                    if (err) done(err);
                    res.status.should.equal(200);
                    res.body[0].username.should.equal("toto");
                    should.exist(res.body[0].id);
                    done();
                });
        });


    });

    describe('POST users with trying force Role', function() {
        this.timeout(60000);

        it('should insert user in BDD with role 0', (done) => {
            request(app)
                .post('/v1/users')
                .send({"username": "arthur", "email": "gigolo@carotte.fr", "password": "toto", "role":2})
                .end((err, res) => {
                    if (err) done(err);
                    models.users.findOne({ where: {email: 'gigolo@carotte.fr'} }).then(value => {
                        if(value == null) {
                            done("l'utilisateur n'a pas été enregistré en bdd")
                        }
                        if(value.role != 0){
                            done("l'utilisateur n'a pas le bon role")
                        }
                        done();
                    });
                });
        });
    });

    afterEach( (done) => {
        models.users.destroy({
            where: {},
            truncate: {cascade : true}
        }).then(value => {
            done();
        })
    })
});