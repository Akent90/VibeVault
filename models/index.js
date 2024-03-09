const sequelize = require('../config/connection');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Define associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Export models and sequelize connection
module.exports = {
    sequelize,
    User,
    Post,
    Comment
};