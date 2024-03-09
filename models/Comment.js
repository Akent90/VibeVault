const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        commentText: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                len: [1],
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        postId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'comment',
    }
);

Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'commentUser'
});

module.exports = Comment;