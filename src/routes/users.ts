import express from "express";
let models  = require('../models');
let router  = express.Router();
let common = require('./common');

router.get('/',common.get(models.users,["username", "email"]));

router.post('/', common.post(models.users));

module.exports = router;