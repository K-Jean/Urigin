module.exports = (sequelize, DataTypes) => {
    let Relation = sequelize.define('relations', {
        isBlocked :{
            type : DataTypes.BOOLEAN
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });

    return Relation;
};