let env       = process.env.NODE_ENV || 'development';
let config    = require("../config/config")[env];

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    }, {
        schema: config.schema
    });

    return User;
};