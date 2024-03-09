const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./connection')

module.exports = {
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    cookie: {
        maxAge: 15 * 60 * 1000, // 15 minutes 
    },
    resave: false, 
    saveUninitialized: true, 
    store: new SequelizeStore({
        db: sequelize,
    }),
};