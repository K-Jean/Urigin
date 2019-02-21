import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";

let router  = express.Router();

router.get('/', common.get(models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:id/types', common.getByRelation(models.games,{model: models.types, as: 'types'}, ["name","description"]));
router.get('/:id/users', common.getByRelation(models.games,{model: models.users, as: 'users'}, ["username"]));
router.get('/:id/comments', common.getByRelation(models.games,{model: models.comments, as: 'comments'}, ["content","createdAt","updatedAt"]));

router.post('/',common.checkRole(Roles.CREATOR),common.post(models.games));
router.post('/:id/comments', common.isAuthenticate(), common.post(models.games));

router.put('/:id',common.checkRole(Roles.CREATOR), common.checkId('id',models.games,{model: models.users, as:'users'}) ,common.put(models.games));
router.put('/{gameId}/comment/{commentId}',common.isAuthenticate(), common.checkId('commentId',models.comments,{model: models.users, as:'users'}), (request, response)=>{
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
module.exports = router;