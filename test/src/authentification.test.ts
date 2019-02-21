//Our app, express
import {app} from "../../src"
import request from 'supertest'
import {models} from "../../src/models"
import {Security} from "../../src/security/security";
import {UriginError} from "../../src/common/UriginError";
import {createUser} from "./common";
import {Roles} from "../../src/common/roles";

const chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');
chai.use(chaiJsonEqual);
const should = chai.should();

//body-parser for parsing req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

var passwordEncrypted = "$2b$10$isKh52YxNPNWJa7UvM3Gw.cITm.Vm/D9YAnzHFdydqDolV6K1cyhu";
var password = "password";

//describe() declares a test suite
describe('Authentification Test case', function() {
    this.timeout(60000);

    before(async () => {
        await models.sequelize.sync({
            force: true
        });
    });

    describe('POST login', function() {
        this.timeout(60000);

        before(async () => {
            await createUser();
        });

        it('should return token', (done) => {
            request(app)
                .post('/v1/users/login')
                .send({"email": "toto@toto.fr", "password" : password})
                .end((err, res) => {
                    console.log(res.body);
                    res.status.should.equal(200);
                    should.exist(res.body);
                    Security.verifyToken(res.body, ((err1, decoded) => {
                        if(err1) done("le decodage du token n'a pas marché");
                        decoded.role.should.equal(Roles.ADMIN);
                        decoded.username.should.equal("toto");
                        done();
                    }));
                });
        });

        it('no password should raise an error', (done) => {
            request(app)
                .post('/v1/users/login')
                .send({"email": "toto@toto.fr"})
                .end((err, res) => {
                    res.status.should.equal(400);
                    should.exist(res.body);
                    res.body.description.should.equal(UriginError.PARAMETER_MANDATORY.replace("%d", "password"));
                    done();
                });
        });

        it('no username should raise an error', (done) => {
            request(app)
                .post('/v1/users/login')
                .send({"password": "atatdkjd"})
                .end((err, res) => {
                    res.status.should.equal(400);
                    should.exist(res.body.description);
                    res.body.description.should.equal(UriginError.PARAMETER_MANDATORY.replace("%d", "email"));
                    done();
                });
        });

        it('bad password should raise an error', (done) => {
            request(app)
                .post('/v1/users/login')
                .send({"email": "toto@toto.fr", "password" : "dudhdugy"})
                .end((err, res) => {
                    res.status.should.equal(400);
                    should.exist(res.body);
                    res.body.description.should.equal(UriginError.PASSWORD_INVALID);
                    done();
                });
        });

        it('bad email should raise an error', (done) => {
            request(app)
                .post('/v1/users/login')
                .send({"email": "bademail@toto.fr", "password" : "dudhdugy"})
                .end((err, res) => {
                    res.status.should.equal(400);
                    should.exist(res.body);
                    res.body.description.should.equal(UriginError.NO_USER_FOUND);
                    done();
                });
        });


    });

    after( (done) => {
        models.users.destroy({
            where: {},
            truncate: {cascade : true}
        }).then(value => {
            done();
        })
    })
});