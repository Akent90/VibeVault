const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Sign up route for form submission
router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        // Save the session and then redirect
        req.session.save(() => {
            req.session.userId = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            // Redirect to the dashboard after successful signup
            res.redirect('/dashboard');
        });
    } catch (err) {
        // If an error occurs, respond with the error
        res.status(400).json(err);
    }
});

// Login route for form submission
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, userData.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.userId = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.redirect('/dashboard');
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;