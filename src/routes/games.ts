import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";
import {checkId} from "./common";
import {UriginError} from "../common/UriginError";
import {UniqueConstraintError} from "sequelize";

let router  = express.Router();

router.get('/', common.get(models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:gameId', common.getByPk('gameId',models.games,["name", "description","createdAt","updatedAt"]));
router.get('/:gameId/types', common.getByRelation(models.games,'getTypes', ["name","description"], "gameId"));
router.get('/:gameId/users', common.getByRelation(models.games, 'getUsers', ["username"], "gameId"));
router.get('/:gameId/comments', common.getByRelation(models.games,'getComments', ["content","createdAt","updatedAt"], "gameId"));

router.post('/',common.isAuthenticate(),common.checkRole(Roles.CREATOR), (req,rep) => {
    req.body.creatorId = req.decoded.id;
    return common.post(models.games)(req,rep);
});

router.post('/:gameId/comments', common.isAuthenticate(), function(req,res){
    req.body.userId = req.decoded.id;
    req.body.gameId = req.params.gameId;
    return common.post(models.comments)(req,res);
});

router.post('/:gameId/types',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.checkId('gameId',models.games,{model: models.users, as:'creator'}),function (request, response) {
    models.games.findByPk(request.params.gameId).then(game => {
        if (game == null){
            response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
            return;
        }
        models.types.findByPk(request.body.typeId).then(function (type) {
            if (type == null) response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            else {
                game.addTypes(type);
                response.json("OK");
            }
        }).catch(err => {
            if (err instanceof UniqueConstraintError) {
                response.status(409).json({description: UriginError.OBJECT_ALREADY_EXIST});
            } else {
                response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            }
        });
    });
});

router.put('/:gameId',common.filterBody({"description": "true"}),common.isAuthenticate(), common.checkRole(Roles.CREATOR), common.checkId('gameId',models.games,{model: models.users, as:'creator'}) , common.putByPk(models.games,"gameId"));

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

router.delete('/:id',common.isAuthenticate(),common.checkRole(Roles.CREATOR,Roles.ADMIN),common.deleteFunc(models.games,[{id:'id'}]));
router.delete('/:gameId/comments/:commentId',common.isAuthenticate(),common.checkRole(Roles.USER,Roles.ADMIN),common.checkId('commentId',models.comments,{model: models.users, as:'users'}, (req,res,next)=>{
    if(req.decoded.role == Roles.ADMIN){
        next();
    }else{
        return res.status(403).json({description: UriginError.FORBIDDEN});
    }
}),common.deleteFunc(models.games,[{id:'gameId'}]));
router.delete('/:gameId/types/:typeId',common.isAuthenticate(),common.checkRole(Roles.CREATOR),common.checkId('gameId',models.games,{model: models.users, as:'users'}),common.deleteFunc(models.comments,[{id:'id'}]));
export default router;