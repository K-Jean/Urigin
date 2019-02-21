import express from "express";
import {models} from "../models";
import {Security} from "../security/security";
import {Roles} from "../common/roles";

let router  = express.Router();
let common = require('./common');

// Seuls les admins peuvent avoir les informations sur les utilisateurs
router.get('/', common.checkRole(Roles.ADMIN), common.get(models.users,["username", "email"]));

router.post('/', function(request, response) {
    request.body.role = Roles.USER;
    return common.post(models.users)(request,response)
});

router.post('/login', function(request, response) {
    models.users.findOne({ where: {email: request.body.email} }).then(value => {
       Security.signToken({email: request.body.email, role: value.role}, (err,token) => {
           response.json(token);
       });
    });
});
// TODO : TEST
router.get('/:id/games', common.getByRelation(models.users,{model: models.games, as: 'games'}, ["name","score","favorite","createAt"]));
router.get('/:id/comments', common.getByRelation(models.users,{model: models.comments, as: 'comments'}, ["content","createdAt","updatedAt"]));
router.get('/:id/relations', function(request,response){
    // TODO : LE CODER
});

router.post('/:id/comments',common.isAuthenticate(),function(request,response){

});
router.post('/:id/relations',common.isAuthenticate(),function(request,response){

});
router.post('/:id/games',common.isAuthenticate(),function(request,response){

});

router.put('/:id/comments',common.isAuthenticate(),function(request,response){

});
router.put('/:id/relations',common.isAuthenticate(),function(request,response){

});
router.put('/:id/games',common.isAuthenticate(),function(request,response){

});
module.exports = router;