// Importing necessary packages 
const express = require('express');
const session = require('express-session');
const expressHandlebars = require('express-handlebars');
const path = require('path');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Automatically import index.js from controllers 
const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    extname: '.handlebars',
}));
app.set('view engine', 'handlebars');

// Set up access to the sequelize store
const sess = {
    secret: process.env.SESSION_SECRET, 
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes 
app.use(routes);

// Start the server and sync sequelize
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
});