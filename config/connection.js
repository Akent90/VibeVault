const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
    // If running on Heroku with JawsDB MySQL, use the JawsDB URL
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // Fallback to separate environment variables for local development
    const config = require('./config.js');
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
    });
}

module.exports = sequelize;