const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Route to render the homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll();
        const posts = postData.map((post) => {
            return {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt
            };
        });

        res.render('home', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Route to render the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

// Route to render the signup page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('signup');
});

// Logout route for ending the session with a GET request
router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

// Route to render the create post page
router.get('/create', withAuth, (req, res) => {
    res.render('create');
});

// Route to handle individual post view
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [{
                model: Comment, 
                as: 'comments',
                include: [{ model: User, as: 'commentUser' }]
            }, {
                model: User, 
                as: 'user'
            }]
        });

        if (!post) {
            return res.status(404).render('404', { message: 'Post not found' });
        }

        console.log(post);

        res.render('post', {
            post: post.get({ plain: true }),
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { errorMessage: 'Error retreiving the post' });
    }
});

module.exports = router;