const fs = require('fs');
const jwt = require('jsonwebtoken');
let env       = process.env.NODE_ENV || 'development';
let config    = require("../config/config")[env];

// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
// use 'utf8' to get string instead of byte array
var privateKEY 	= fs.readFileSync(config.private, 'utf8'); // to sign JWT
var publicKEY 	= fs.readFileSync(config.public, 'utf8'); 	// to verify JWT

// To make the JWT more efficient we need 3 things
var i 	= 'Urigin corp';			// Issuer (Software organization who issues the token)
var a 	= 'http://urigin.fr';	// Audience (Domain within which this token will live and function)

export class Security {



    public static signToken(payload: any, email : string, callback :(err: any, token:any) => void){
        // Token signing options
        let signOptions = {
            issuer: 	i,
            subject: 	email,
            audience: 	a,
            expiresIn: 	"12h",
            algorithm: 	"RS256" 			// RSASSA options[ "RS256", "RS384", "RS512" ]
        };
        return jwt.sign(payload, privateKEY, signOptions, callback);
    }

    public static verifyToken(token: any, email : string, callback :(err: any, decoded:any) => void){
        // Token signing options
        let verifyOptions = {
            issuer: 	i,
            subject: 	email,
            audience: 	a,
            expiresIn: 	"12h",
            algorithm: 	["RS256"] 			// RSASSA options[ "RS256", "RS384", "RS512" ]
        };
        return jwt.verify(token, publicKEY, verifyOptions, callback);
    }
}