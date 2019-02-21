import express from "express";
import {models} from "../models";
import {Security} from "../security/security";
import {Roles} from "../common/roles";
import {UriginError} from "../common/UriginError";

let router = express.Router();
let common = require('./common');
const bcrypt = require('bcrypt');

router.get('/', common.checkRole(Roles.ADMIN), common.get(models.users, ["username", "email"]));

router.post('/',common.checkBody(["email","username","password"]),(request, response) => {
    request.body.role = 0;
    console.log(request.body);
    bcrypt.hash(request.body.password, 10).then(hash => {
        request.body.password = hash;
        // Store hash in your password DB.
        return common.post(models.users)(request, response)
    }).catch(err => {
        if(err) response.status(500).json({description: UriginError.ENCRYPTION_ERROR});
    });
});

router.post('/login',common.checkBody(["email","password"]), function (request, response) {
    models.users.findOne({where: {email: request.body.email}}).then(value => {
        if (value == null) {
            response.status(400).json({description: UriginError.NO_USER_FOUND});
            return;
        }
        bcrypt.compare(request.body.password, value.password).then(res => {
            if (res) {
                Security.signToken({id: value.id, username: value.username, role: value.role}, (err, token) => {
                    response.json(token);
                });
            } else {
                response.status(400).json({description: UriginError.PASSWORD_INVALID});
            }
        });
    });
});

module.exports = router;