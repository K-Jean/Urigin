import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";
import {checkId} from "./common";
import {UriginError} from "../common/UriginError";

let router  = express.Router();

router.get('/', common.get(models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:id', common.getByPk('id',models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:id/types', common.getByRelation(models.games,{model: models.types, as: 'types'}, ["name","description"]));
router.get('/:id/users', common.getByRelation(models.games,{model: models.users, as: 'users'}, ["username"]));
router.get('/:id/comments', common.getByRelation(models.games,{model: models.comments, as: 'comments'}, ["content","createdAt","updatedAt"]));

router.post('/',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.post(models.games));
router.post('/:id/comments', common.isAuthenticate(), function(req,res){
    models.games.findByPk(req.params.id).then(function(obj){
        models.comments.create(req.body).then(function(comment){
            obj.addComments(comment)
        });
    });
},common.post(models.comments));
router.post('/:id/types',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.checkId('id',models.games,{model: models.users, as:'users'}),function (request, response) {
    models.games.findByPk(request.params.id).then(function(objects1){
        models.types.findByPk(request.body['typeId']).then(function(objects){
            return objects1['addTypes'](objects);
        });
    });
});

router.put('/:id',common.isAuthenticate(),common.checkRole(Roles.CREATOR), common.checkId('id',models.games,{model: models.users, as:'users'}) ,common.put(models.games));
router.put('/{gameId}/comments/{commentId}',common.isAuthenticate(), common.checkId('commentId',models.comments,{model: models.users, as:'users'}), (request, response)=>{
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

router.delete('/:id',common.isAuthenticate(),common.checkRole(Roles.CREATOR,Roles.ADMIN),common.deleteFunc(models.games,[{id:'id'}]));
router.delete('/:gameId/comments/:commentId',common.isAuthenticate(),common.checkRole(Roles.USER,Roles.ADMIN),common.checkId('commentId',models.comments,{model: models.users, as:'users'}, (req,res,next)=>{
    if(req.decoded.role == Roles.ADMIN){
        next();
    }else{
        return res.status(403).json({description: UriginError.FORBIDDEN});
    }
}),common.deleteFunc(models.games,[{id:'gameId'}]));
router.detele('/:gameId/types/:typeId',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.checkId('gameId',models.games,{model: models.users, as:'users'}),common.deleteFunc(models.comments,[{id:'id'}]));
export default router;