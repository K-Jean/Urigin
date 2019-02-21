import {Security} from "../security/security";
import {UriginError} from "../common/UriginError";
import {UniqueConstraintError} from "sequelize";
import {models} from "../models";

export function get(models, attributes) {
    return function (request, response) {
        models.findAll().then(function (objects) {
            let result = [];

            for (let obj of objects) {
                let res = new Object();
                for (let attribute of attributes) {
                    res[attribute] = obj[attribute];
                }

                result.push(res);
            }

            response.json(result);
        })
    }
}

export function getByPk(pkItem, models, attributes) {
    return function (request, response) {
        models.findByPk(request.params[pkItem]).then(function (obj) {
            if (obj == null){
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
export function deleteFunc(models,conditions){
    return (req,res)=>{
        let cond = {};
        for(let key in Object.keys(conditions)){
            cond[key] = req.body[conditions[key]];
        }
        models.destroy({
           where:cond
        }).then(()=>{
            return res.status(200);
        });
    }
}
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
                            res[attribute] = obj[attribute];
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

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

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

export function checkRole(...roles) {
    return (req, res, next) => {
        if (roles.includes(req.decoded.role)) {
            next();
        } else {
            return res.status(403).json({description: UriginError.FORBIDDEN});
        }
    }
}

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