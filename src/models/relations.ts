module.exports = (sequelize, DataTypes) => {
    let Relation = sequelize.define('relations', {
        value :{
            type : DataTypes.STRING
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