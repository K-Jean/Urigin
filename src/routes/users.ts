import express from "express";
import {models} from "../models";
let router  = express.Router();
let common = require('./common');

router.get('/',common.get(models.users,["username", "email"]));

router.post('/', function(request, response) {
    request.body.role = 0;
    return common.post(models.users)(request,response)
});

module.exports = router;