import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";

let router  = express.Router();

// Get de type
router.get('/', common.get(models.types,["id","name", "description","createdAt","updatedAt"]));
router.get('/:typeId',common.getByPk('typeId',models.types,["id","name", "description","createdAt","updatedAt"]));
// Post de type
router.post('/',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.post(models.types));
// Put de type
router.put('/:typeId',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.putByPk(models.types,"typeId"));
// Delete de type
router.delete('/:typeId',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.deleteFunc(models.types,{id:"typeId"}));
export default router;