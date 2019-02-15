import express from "express";
let models  = require('../models');
let router  = express.Router();

export function get(model, attributes){
    return function(request, response) {
        model.findAll().then(function(objects) {
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

export function put(model){
    return function(request, response) {
        model.findByPk(request.params.id).then(function(objects) {
            objects.update(request.body).then( (result,rejected) => {
                response.json(result);
            });
        })
    }
}

export function getByRelation(model, relation, attributes){
    return function(request, response) {
        model.findByPk(request.params.id, {include : [relation]}).then(function(objects) {
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

export function post(model){
    return function(request, response) {
        model.create(request.body).then(function(objects) {
            response.json(objects);
        })
    }
}