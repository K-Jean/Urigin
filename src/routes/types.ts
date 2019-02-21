import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";

let router  = express.Router();
let common = require('./common');

// TODO : A tester
router.get('/', common.get(models.types,["name", "description","createdAt","updatedAt"]));
router.get('/:id',common.getByPk('id',models.types,["name", "description","createdAt","updatedAt"]));

router.post('/',common.checkRole(Roles.CREATOR),common.post(models.types));

router.put('/:id',common.checkRole(Roles.CREATOR),common.put(models.types));

module.exports = router;