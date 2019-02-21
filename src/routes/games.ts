import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";

let router  = express.Router();

router.get('/', common.get(models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:gameId', common.getByPk('gameId',models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:gameId/types', common.getByRelation(models.games,{model: models.types, as: 'types'}, ["name","description"]));
router.get('/:gameId/users', common.getByRelation(models.games,{model: models.users, as: 'users'}, ["username"]));
router.get('/:gameId/comments', common.getByRelation(models.games,{model: models.comments, as: 'comments'}, ["content","createdAt","updatedAt"]));

router.post('/',common.isAuthenticate(), common.checkRole(Roles.CREATOR),common.post(models.games));
router.post('/:gameId/comments', common.isAuthenticate(), common.post(models.games));

router.put('/:gameId',common.isAuthenticate(), common.checkRole(Roles.CREATOR), common.checkId('gameId',models.games,{model: models.users, as:'creator'}) , (req,rep) => {
    req.body.userId = req.decoded.id;
    return common.putByPk(models.games,"gameId")
    });
router.put('/:gameId/comments/:commentId',common.isAuthenticate(), common.checkId('commentId',models.comments,{model: models.users, as:'users'}), (request, response)=>{
    models.comments.findByPk(request.params['commentId'], {include: ['games']}).then(function (objects) {
        if(objects['games']['id'] == request.decoded.gameId){
            objects.update(request.body).then((result, rejected) => {
                response.json(result);
            });
        }else{
            return request.status(400).send({
                description: 'Access denied.'
            });
        }
    });
});
export default router;