module.exports = (sequelize, DataTypes) => {
    let Comment = sequelize.define('comments', {
        content:{
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    Comment.associate = function (models) {
        models.comments.belongsTo(models.games);
        models.comments.belongsTo(models.users, {as : 'author'});
    };
    return Comment;
};