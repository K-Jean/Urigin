import express from "express";
import {models} from "../models";
import {Security} from "../security/security";

let router  = express.Router();
let common = require('./common');

router.get('/',common.get(models.users,["username", "email"]));

router.post('/', function(request, response) {
    request.body.role = 0;
    return common.post(models.users)(request,response)
});

router.post('/login', function(request, response) {
    models.users.findOne({ where: {email: request.body.email} }).then(value => {
       Security.signToken({email: request.body.email, role: value.role}, request.body.email, (err,token) => {
           response.json(token);
       });
    });
});

module.exports = router;