module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        }
    });

    return User;
};