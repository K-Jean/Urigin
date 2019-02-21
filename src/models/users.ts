module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.INTEGER
        }
    });

    User.associate = function (models) {
        models.users.belongsToMany(models.games, {
            through:  "users_games",
            as :'game'
        });
        models.users.hasMany(models.comments);
        models.users.belongsToMany(models.users, {
            through: {
                model: models.relations
            },
            as: "other"
        });
    };

    return User;
};