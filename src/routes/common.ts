import express from "express";

let router = express.Router();
import {Security} from "../security/security";

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

export function put(models) {
    return function (request, response) {
        models.findByPk(request.params.id).then(function (objects) {
            objects.update(request.body).then((result, rejected) => {
                response.json(result);
            });
        })
    }
}

export function getByRelation(models, relation, attributes) {
    return function (request, response) {
        models.findByPk(request.params.id, {include: [relation]}).then(function (objects) {
            let result;

            if (isIterable(objects[relation["as"]])) {
                result = [];
                for (let obj of objects[relation["as"]]) {
                    let res = new Object();
                    for (let attribute of attributes) {
                        res[attribute] = obj[attribute];
                    }

                    result.push(res);
                }
            } else {
                result = new Object();
                for (let attribute of attributes) {
                    result[attribute] = objects[relation["as"]][attribute];
                }
            }
            let ret = {};
            ret[relation["as"]] = result;
            response.json(ret);
        })
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

export function post(models) {
    return function (request, response) {
        models.create(request.body).then(function (objects) {
            response.json(objects);
        })
    }
}

export function isAuthenticate(){
    return function secureAPI(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        // decode token
        if (token) {

            // verifies secret and checks exp
            Security.verifyToken(token, function (err, decoded) {
                if (err) {
                    return res.status(401).json({description: 'Failed to authenticate token.'});
                } else {
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(401).send({
                description: 'No token provided.'
            });

        }
    };
}

export function checkRole(role) {
    return function secureAPI(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        // decode token
        if (token) {

            // verifies secret and checks exp
            Security.verifyToken(token, function (err, decoded) {
                if (err) {
                    return res.status(401).json({description: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    if(req.decoded.role == role) {
                        next();
                    } else {
                        return res.status(403).json({description: 'You don\'t have enough perogative.'});
                    }
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(401).send({
                description: 'No token provided.'
            });

        }
    };
}

export function checkId(pkItem,models, relation){
    return (req, res, next)=>{
        models.findByPk(req.params[pkItem], {include: [relation]}).then(function (objects) {
            if(objects[relation['as']]['id'] == req.decoded.id){
                next();
            }else{
                return res.status(403).send({
                    description: 'Access denied.'
                });
            }
        });
    }
}