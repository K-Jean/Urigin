module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.INTEGER
        }
    });

    return User;
};