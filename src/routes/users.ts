import express from "express";
import {models} from "../models";
import {Security} from "../security/security";
import {Roles} from "../common/roles";

let router  = express.Router();
let common = require('./common');

router.get('/', common.checkRole(Roles.ADMIN), common.get(models.users,["username", "email"]));

router.post('/', function(request, response) {
    request.body.role = 0;
    return common.post(models.users)(request,response)
});

router.post('/login', function(request, response) {
    models.users.findOne({ where: {email: request.body.email} }).then(value => {
       Security.signToken({email: request.body.email, role: value.role}, (err,token) => {
           response.json(token);
       });
    });
});

module.exports = router;