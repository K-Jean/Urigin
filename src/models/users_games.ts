module.exports = (sequelize, DataTypes) => {
    let UserGame = sequelize.define('users_games',{
        score :{
            type : DataTypes.INTEGER
        },
        favorite:{
            type: DataTypes.BOOLEAN
        },
        createAt:{
            type : DataTypes.DATE
        }

    });

    return UserGame;
};