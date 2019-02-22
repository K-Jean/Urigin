// Table des jeux
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
        models.games.belongsToMany(models.types, {
            through:  "types_games",
            as: "types",
            // Permet la suppression des relations dans les tables d'assossiation
            onDelete:'cascade'
        });
        models.games.belongsTo(models.users, {as: 'creator'});
        models.games.belongsToMany(models.users, {
            through:  "users_games",
            as: "gamers"
        });
    };
    return Game;
};