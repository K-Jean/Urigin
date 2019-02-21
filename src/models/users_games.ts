module.exports = (sequelize, DataTypes) => {
    let UserGame = sequelize.define('users_games',{
        score :{
            type : DataTypes.INTEGER
        },
        favorite:{
            type: DataTypes.BOOLEAN
        },
        createdAt:{
            type : DataTypes.DATE
        }

    });

    return UserGame;
};