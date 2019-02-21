module.exports = (sequelize, DataTypes) => {
    let Type = sequelize.define('types', {
        name:{
            type : DataTypes.STRING
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
    Type.associate = function (models) {
        models.types.belongsToMany(models.games, {
            through:  "types_games",
            as: "games",
            onDelete:'cascade'
        });
    };
    return Type;
};