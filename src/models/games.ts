module.exports = (sequelize, DataTypes) => {
    let Game = sequelize.define('games', {
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    Game.associate = function (models) {
        models.games.hasMany(models.comments,{onDelete:'cascade'});
        models.games.hasMany(models.types);
        models.games.belongsToMany(models.users, {
            through:  "users_games",
            as: "creator"
        });
    };
    return Game;
};