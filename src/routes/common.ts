import express from "express";
let router  = express.Router();

export function get(models, attributes){
    return function(request, response) {
        models.findAll().then(function(objects) {
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

export function put(models){
    return function(request, response) {
        models.findByPk(request.params.id).then(function(objects) {
            objects.update(request.body).then( (result,rejected) => {
                response.json(result);
            });
        })
    }
}

export function getByRelation(models, relation, attributes){
    return function(request, response) {
        models.findByPk(request.params.id, {include : [relation]}).then(function(objects) {
            let result;

            if(isIterable(objects[relation["as"]])){
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

export function post(models){
    return function(request, response) {
        models.create(request.body).then(function(objects) {
            response.json(objects);
        })
    }
}