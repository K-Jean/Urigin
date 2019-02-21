import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";

let router  = express.Router();

// TODO : A tester
router.get('/', common.get(models.types,["name", "description","createdAt","updatedAt"]));

router.post('/',common.checkRole(Roles.CREATOR),common.post(models.types));

router.put('/',common.checkRole(Roles.CREATOR),common.put(models.types));

export default router;