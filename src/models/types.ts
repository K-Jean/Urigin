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
        models.comments.belongsTo(models.games);
    };
    return Type;
};