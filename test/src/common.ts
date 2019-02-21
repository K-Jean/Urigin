import {models} from "../../src/models";

var passwordEncrypted = "$2b$10$isKh52YxNPNWJa7UvM3Gw.cITm.Vm/D9YAnzHFdydqDolV6K1cyhu";
var password = "password";

export async function createUser(){
    await models.users.create({"username": "toto", "email": "toto@toto.fr", "role" : 2, "password": passwordEncrypted});
}
export async function createUserAndGetToken(app, request){
    await createUser();
    let tokens = await request(app)
        .post('/v1/users/login')
        .send({ email: 'toto@toto.fr', password: password });
    return tokens.body;
}