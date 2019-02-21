import express from "express";
import {models} from "../models";
import {Security} from "../security/security";
import {Roles} from "../common/roles";
import {UriginError} from "../common/UriginError";
import * as common from "./common";
import bcrypt from "bcrypt";

const router = express.Router();

// Seuls les admins peuvent avoir les informations sur les utilisateurs
router.get('/', common.isAuthenticate(), common.checkRole(Roles.ADMIN), common.get(models.users,["id", "username", "role"]));
// TODO : TEST
router.get('/:userId',common.getByPk('userId',models.users,["id","username"]));
router.get('/:id/relations', common.checkId('id',models.users), common.getByRelation(models.users,{model:models.relations, as:'relations'},['otherId','isBlocked','createAt','updatedAt']));
router.get('/:id/games', common.getByRelation(models.users,{model: models.games, as: 'games'}, ["name","score","favorite","createAt"]));

router.post('/',common.checkBody(["email","username","password"]),(request, response) => {
    request.body.role = Roles.USER;
    bcrypt.hash(request.body.password, 10).then(hash => {
        request.body.password = hash;
        // Store hash in your password DB.
        return common.post(models.users)(request, response)
    }).catch(err => {
        if(err) response.status(500).json({description: UriginError.ENCRYPTION_ERROR});
    });
});
router.post('/login',common.checkBody(["email","password"]), function (request, response) {
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
        });
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
router.post('/:userId/relations/',common.isAuthenticate(),common.checkId('userId',models.users),common.postAssos(models.relations,'addOther','userId'));
router.post('/:userId/games/',common.isAuthenticate(),common.checkId('userId',models.users),common.postAssos(models.games,'addGame','gameId'));

router.put('/:userId/relations/:relationId',common.isAuthenticate(),common.checkId('userId',models.users),common.putByPk(models.relations,'relationId'));
router.put('/:userId/games/:gameId',common.isAuthenticate(),common.checkId('userId',models.users),common.putByPk(models.games,'gameId'));
export default router;