module.exports = (sequelize, DataTypes) => {
    let UserGame = sequelize.define('users_games',{
        score :{
            type : DataTypes.INTEGER
        },
        favorite:{
            type: DataTypes.BOOLEAN
        },
        buyAt: {
            type: DataTypes.DATE
        }

    });

    return UserGame;
};