import {Security} from "../security/security";
import {UriginError} from "../common/UriginError";
import {UniqueConstraintError} from "sequelize";
import {models} from "../models";


/**
 * Fonction générique qui permet de répondre à une requete get
 * @param models = table qu'on souhaite récupérer
 * @param attributes = array des attributs qu'on veux récupérer de la table
 */
export function get(models, attributes) {
    return function (request, response) {
        let start = request.query.start ? request.query.start : 0;
        let limit = request.query.limit ? request.query.limit : 10;
        models.findAll({offset: start, limit: limit}).then(function (objects) {
            let result = [];
            let resultQuery = [];
            for (let obj of objects) {
                let res = new Object();
                for (let attribute of attributes) {
                    res[attribute] = obj[attribute];
                }
                resultQuery.push(res);
            }
            result.push({result : resultQuery});
            if(objects.length == Math.abs(limit-start)){
                result.push({
                    next: request.protocol + '://' + request.get('host') + request.baseUrl + request.path.substring(0, request.path.length-1) + "?start=" + Number(start+limit) + "&limit=" + limit
                });
            }
            if(start != 0){
                result.push({
                    previous: request.protocol + '://' + request.get('host') + request.baseUrl + request.path.substring(0, request.path.length-1) + "?start=" + Number(start-limit) + "&limit=" + limit
                });
            }
            response.json(result);
        })
    }
}

/**
 * Permet de recupérer une ligne spécifique d'une table à partir de la primary key
 * @param pkItem = nom de la primary key
 * @param models = table qu'on souhaite récupérer
 * @param attributes = array des attributs qu'on souhaite récupérer de la table
 */
export function getByPk(pkItem, models, attributes) {
    return function (request, response) {
        models.findByPk(request.params[pkItem]).then(function (obj) {
            if (obj == null){
                // Si l'object correspondant à la Pk n'hésite pas en BD
                response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                return;
            }
            let res = new Object();
            for (let attribute of attributes) {
                res[attribute] = obj[attribute];
            }
            response.json(res);
            return;
        }).catch(err => {
            response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
        })
    }
}

/**
 * Permet de mettre de la donnée dans le BD
 * @param models = table sur laquelle on souhaite travaillé
 */
export function post(models) {
    return function (request, response) {
        models.create(request.body).then(function (objects) {
            if (objects == null) response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            response.json("OK");
        }).catch(err => {
            if (err instanceof UniqueConstraintError) {
                response.status(409).json({description: UriginError.OBJECT_ALREADY_EXIST});
            } else {
                response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            }
        })
    }
}

/**
 * Permet d'ajouter une association dans une table d'association à partir des Fk
 * @param models = la table d'associaition
 * @param conditions = les Fk
 */
export function putAssos(models,conditions){
    return function (request, response) {
        let cond = {};
        for(let key in conditions){
            cond[key] = request.params[conditions[key]];
        }
        models.findAll({where : cond}).then(function (objects) {
            if (objects.length == 0){
                response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                return;
            }
            objects[0].update(request.body).then((result, rejected) => {
                response.json("OK");
            });
        })
    }
}

/**
 * Permet d'update de la donnée en BD à partir de la valeur de la Pk
 * @param models = table qu'on souhaite mettre à jour
 * @param pkName = valeur de la pK
 */
export function putByPk(models, pkName) {
    return function (request, response) {
        models.findByPk(request.params[pkName]).then(function (objects) {
            if (objects == null){
                response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                return;
            }
            objects.update(request.body).then((result, rejected) => {
                response.json("OK");
            });
        })
    }
}

/**
 * Permet de supprimer de la donnée en BD à partir d'une table et des conditions
 * @param models =  table qu'on souhaite mettre à jour
 * @param conditions = object contenant les condtions {"nom de la colonne en BD" : "nom de la value dans les params"}
 */
export function deleteFunc(models,conditions){
    return (req,res)=>{
        let cond = {};
        for(let key in conditions){
            cond[key] = req.params[conditions[key]];
        }
        models.destroy({
           where:cond
        }).then(()=>{
            res.status(200).json('OK');
        });
    }
}

/**
 * Permet de recupérer de l'information d'un table à partir d'un autre grâce à la liaison entre les 2
 * @param models : table de départ
 * @param relation : nom de la fonction qui permet de récupérer la table lié à models
 * @param attributes : nom des attributs que l'on souhaite récupérer
 * @param pkName = nom de la pK pour la table de départ
 */
export function getByRelation(models, relation, attributes, pkName) {
    return function (request, response) {
        models.findByPk(request.params[pkName]).then(function (objects) {
            objects[relation]().then(objects => {
                if (objects == null){
                    response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                    return;
                }
                let result;

                if (isIterable(objects)) {
                    result = [];
                    for (let obj of objects) {
                        let res = new Object();
                        for (let attribute of attributes) {
                            if(typeof attribute  == "string"){
                                res[attribute] = obj[attribute];
                            } else {
                                Object.keys(attribute).forEach(key => {
                                    for (let subattribute of attribute[key]) {
                                        res[subattribute] = obj[key][subattribute];
                                    }
                                });
                            }
                        }

                        result.push(res);
                    }
                } else {
                    result = new Object();
                    for (let attribute of attributes) {
                        result[attribute] = objects[attribute];
                    }
                }
                response.json(result);
            });
        })
    }
}

/**
 * Permet de faire des actions sur les relations (add,get,remove...)
 * @param models = 1er table
 * @param models2 = 2eme table
 * @param relation = methode qu'on souhaite faire
 * @param pkName = pK de la 1er table
 * @param pkName2 = pK de la 2eme table
 */
export function actionOnRelation(models, models2, relation, pkName, pkName2) {
    return function (request, response) {
        models.findByPk(request.params[pkName]).then(object => {
            if (object == null){
                response.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                return;
            }
            models2.findByPk(request.body[pkName2]).then(function (type) {
                if (type == null) response.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
                else {
                    object[relation](type, {through : request.body});
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
    }
}

/**
 * Test si on peut itérer sur un objet
 * @param obj
 */
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

/**
 * Permet de filtrer le body afin de retirer les clés que l'on ne souhaite pas communiquer à la BD
 * @param jsonfilter
 */
export function filterBody(jsonfilter) {
    return (req, res, next) => {
        Object.keys(req.body).forEach(parameter => {
            if(!jsonfilter.hasOwnProperty(parameter)) {
                delete req.body[parameter];
            }
        });
        Object.keys(jsonfilter).forEach(parameter => {
            if (!req.body.hasOwnProperty(parameter) && jsonfilter[parameter]) {
                return res.status(400).json({description: UriginError.PARAMETER_MANDATORY.replace("%d", parameter)});
            }
        });
        next();
    }
}

/**
 * Permet de tester si l'utilisateur est connecté grâce au /login
 */
export function isAuthenticate() {
    return (req, res, next) => {

        // check header or url parameters or post parameters for token
        var token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

        // decode token
        if (token) {
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }
            // verifies secret and checks exp
            Security.verifyToken(token, function (err, decoded) {
                if (err) {
                    return res.status(498).json({description: UriginError.TOKEN_INVALID});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(401).send({
                description: UriginError.NO_TOKEN
            });

        }
    };
}

/**
 * Verifie qu'un utilisateur posséde un certain rôle
 * @param roles = array de roles
 */
export function checkRole(...roles) {
    return (req, res, next) => {
        if (roles.includes(req.decoded.role)) {
            next();
        } else {
            return res.status(403).json({description: UriginError.FORBIDDEN});
        }
    }
}

/**
 * Permet de verifier que celui qui fais la requête est le createur de la donnée en BD
 * @param pkItem = nom de la value qui correspond à la Pk dans la requete
 * @param models = table
 * @param relation = facultatif, si on a besoin de parcourir une relation pour obtenir l'utilisateur
 * @param callbackFail = facultatif, si on souhaite faire une callback spécial si l'utilisateur n'est pas le créateur
 */
export function checkId(pkItem, models, relation?, callbackFail?) {
    return (req, res, next) => {
        if (relation) {
            models.findByPk(req.params[pkItem], {include: [relation]}).then(function (objects) {
                if (objects == null){
                    res.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                    return;
                }
                if (objects[relation['as']]['id'] == req.decoded.id) {
                    next();
                } else {
                    if (callbackFail) {
                        callbackFail(req,res,next);
                    } else {
                        return res.status(403).send({
                            description: UriginError.FORBIDDEN
                        });
                    }
                }
            }).catch(err => {
                res.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            });
        } else {
            models.findByPk(req.params[pkItem]).then(function (objects) {
                if (objects == null){
                    res.status(404).json({description: UriginError.OBJECT_NOT_FOUND});
                    return;
                }
                if (objects['id'] == req.decoded.id) {
                    next();
                } else {
                    if (callbackFail) {
                        callbackFail();
                    } else {
                        return res.status(403).send({
                            description: UriginError.FORBIDDEN
                        });
                    }
                }
            }).catch(err => {
                res.status(500).json({description: UriginError.ERROR_WITH_DATABASE});
            });
        }
    }
}