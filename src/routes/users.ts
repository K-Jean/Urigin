import express from "express";
import {models} from "../models";
import {Security} from "../security/security";
import {Roles} from "../common/roles";
import {UriginError} from "../common/UriginError";
import * as common from "./common";
import bcrypt from "bcrypt";
import {checkId, deleteFunc} from "./common";

const router = express.Router();

// Seuls les admins peuvent avoir les informations sur les utilisateurs
router.get('/', common.isAuthenticate(), common.checkRole(Roles.ADMIN), common.get(models.users,["id", "username", "role"]));
// TODO : TEST
router.get('/:userId',common.getByPk('userId',models.users,["id","username"]));
router.get('/:userId/relations', common.isAuthenticate(), common.checkId('userId',models.users), common.getByRelation(models.users,'getOther',['id','username',{ 'relations': ['isBlocked']},'createAt','updatedAt'], 'userId'));
router.get('/:userId/games', common.getByRelation(models.users,'getGame', ["id","name","description",{ 'users_games': ['score', 'favorite']},"createAt"], 'userId'));

router.post('/',common.filterBody({"email" : "true","username" : "true","password" : "true"}),(request, response) => {
    request.body.role = Roles.USER;
    bcrypt.hash(request.body.password, 10).then(hash => {
        request.body.password = hash;
        // Store hash in your password DB.
        return common.post(models.users)(request, response)
    }).catch(err => {
        if(err) response.status(500).json({description: UriginError.ENCRYPTION_ERROR});
    });
});
router.post('/login',common.filterBody({"email" : "true","password" : "true"}), function (request, response) {
    models.users.findOne({where: {email: request.body.email}}).then(value => {
        if (value == null) {
            response.status(400).json({description: UriginError.NO_USER_FOUND});
            return;
        }
        bcrypt.compare(request.body.password, value.password).then(res => {
            if (res) {
                Security.signToken({id: value.id, username: value.username, role: value.role}, (err, token) => {
                    response.json(token);
                });
            } else {
                response.status(400).json({description: UriginError.PASSWORD_INVALID});
            }
        }).catch(err => {
            if(err) response.status(500).json({description: UriginError.DECRYPTION_ERROR});
        });
    }).catch(err => {
        if(err) response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
    });
});

router.put('/:userId',common.isAuthenticate(),common.checkId('userId',models.users), (req,res) => {
    delete req.body.role;
    if(req.body.password){
        bcrypt.hash(req.body.password, 10).then(hash => {
            req.body.password = hash;
            return common.putByPk(models.users,"userId")(req,res);
        }).catch(err => {
            if(err) res.status(500).json({description: UriginError.ENCRYPTION_ERROR});
        });
    } else {
        return common.putByPk(models.users,"userId")(req,res);
    }
});

// Table d'assos
router.post('/:userId/relations/',common.isAuthenticate(),common.checkId('userId',models.users),common.actionOnRelation(models.users, models.users,'addOther','userId', 'userId'));
router.post('/:userId/games/',common.isAuthenticate(),common.checkId('userId',models.users),common.actionOnRelation(models.users,models.games,'addGame','userId','gameId'));

router.put('/:userId/relations/:relationId',common.isAuthenticate(),common.checkId('userId',models.users),common.putAssos(models.relations,{userId:'userId',otherId:'relationId'}));
router.put('/:userId/games/:gameId',common.isAuthenticate(),common.checkId('userId',models.users),common.putAssos(models.users_games,{gameId:'gameId',userId:'userId'}));

// delete
router.delete('/:userId',common.isAuthenticate(),common.checkRole(Roles.USER,Roles.CREATOR,Roles.ADMIN),common.checkId('userId',models.users, (req,res,next)=>{
    if(req.decoded.role == Roles.ADMIN){
        next();
    }else{
        return res.status(403).json({description: UriginError.FORBIDDEN});
    }
}),common.deleteFunc(models.users,{id:'userId'}));
router.delete('/:userId/relations/:relationId',common.isAuthenticate(),common.checkId('userId',models.users),(req,res) => {
    req.body.relationId = req.params.relationId;
    return common.actionOnRelation(models.users, models.users, "removeOther", "userId", "relationId")(req,res);
});
router.delete('/:userId/games/:gameId',common.isAuthenticate(),common.checkId('userId',models.users),(req,res) => {
    req.body.gameId = req.params.gameId;
    return common.actionOnRelation(models.users, models.games, "removeGame", "userId", "gameId")(req,res);
});

export default router;