import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";

let router  = express.Router();
let common = require('./common');

// TODO : Faire test
router.get('/', common.get(models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:id/types', common.getByRelation(models.games,{model: models.types, as: 'types'}, ["name","description"]));
router.get('/:id/users', common.getByRelation(models.games,{model: models.users, as: 'users'}, ["username"]));
router.get('/:id/comments', common.getByRelation(models.games,{model: models.comments, as: 'comments'}, ["content","createdAt","updatedAt"]));

router.post('/',common.checkRole(Roles.CREATOR),common.post(models.games));
router.post('/:id/comments', common.isAuthenticate(), common.post(models.games));

router.put('/:id',common.checkRole(Roles.CREATOR),function(request, response){

});
router.put('/:id/comments/:id',common.isAuthenticate(), function(request, response){

});
module.exports = router;