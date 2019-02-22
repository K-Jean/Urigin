import express from "express";
import {models} from "../models";
import {Roles} from "../common/roles";
import * as common from "./common";
import {checkId} from "./common";
import {UriginError} from "../common/UriginError";
import {UniqueConstraintError} from "sequelize";

let router = express.Router();

// Get de games
router.get('/', common.get(models.games, ["name", "description", "createdAt", "updatedAt"]));
router.get('/:gameId', common.getByPk('gameId', models.games, ["name", "description", "createdAt", "updatedAt"]));
router.get('/:gameId/types', common.getByRelation(models.games, 'getTypes', ["id", "name", "description"], "gameId"));
router.get('/:gameId/users', common.getByRelation(models.games, 'getUsers', ["id", "username"], "gameId"));
router.get('/:gameId/comments', common.getByRelation(models.games, 'getComments', ["id", "content", "createdAt", "updatedAt"], "gameId"));

// Post de games
router.post('/', common.isAuthenticate(), common.checkRole(Roles.CREATOR), (req, rep) => {
    req.body.creatorId = req.decoded.id;
    return common.post(models.games)(req, rep);
});
router.post('/:gameId/comments', common.isAuthenticate(), function(req,res){
    req.body.authorId = req.decoded.id;
    req.body.gameId = req.params.gameId;
    return common.post(models.comments)(req, res);
});
router.post('/:gameId/types', common.isAuthenticate(), common.checkRole(Roles.CREATOR), common.checkId('gameId', models.games, {
    model: models.users,
    as: 'creator'
}), common.actionOnRelation(models.games, models.types, "addTypes", "gameId", "typeId"));

// Put de games
router.put('/:gameId', common.filterBody({"description": "true"}), common.isAuthenticate(), common.checkRole(Roles.CREATOR), common.checkId('gameId', models.games, {
    model: models.users,
    as: 'creator'
}), common.putByPk(models.games, "gameId"));
router.put('/:gameId/comments/:commentId',common.isAuthenticate(), common.checkId('commentId',models.comments,{model: models.users, as:'author'}), (request, response)=>{
    // Permet d'assurer que le commentaire correspond bien au jeu
    models.comments.findByPk(request.params['commentId'], {include: {model: models.games, as:'game'}}).then(function (objects) {
        if(objects['game']['id'] == request.params.gameId){
            objects.update(request.body).then((result, rejected) => {
                response.json('OK');
            });
        } else {
            return request.status(400).send({
                description: 'Access denied.'
            });
        }
    });
});

// Delete de games
router.delete('/:gameId',common.isAuthenticate(),common.checkRole(Roles.CREATOR,Roles.ADMIN),common.checkId('gameId',models.games,{model: models.users, as: 'creator'}, (req,res,next)=>{
    if(req.decoded.role == Roles.ADMIN){
        next();
    }else{
        return res.status(403).json({description: UriginError.FORBIDDEN});
    }
}),common.deleteFunc(models.games,{id:'gameId'}));
router.delete('/:gameId/comments/:commentId',common.isAuthenticate(),common.checkId('commentId',models.comments,{model: models.users, as:'author'}, (req,res,next)=>{
    if(req.decoded.role == Roles.ADMIN){
        next();
    } else {
        return res.status(403).json({description: UriginError.FORBIDDEN});
    }
}),common.deleteFunc(models.comments,{id:'commentId'}));
router.delete('/:gameId/types/:typeId', common.isAuthenticate(), common.checkRole(Roles.CREATOR), common.checkId('gameId', models.games, {model: models.users, as: 'creator'}), (req,res) => {
    req.body.typeId = req.params.typeId;
    return common.actionOnRelation(models.games, models.types, "removeTypes", "gameId", "typeId")(req,res);
});
export default router;