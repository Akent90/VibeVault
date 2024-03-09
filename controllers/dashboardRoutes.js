const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

// Route to render the dashboard page, only for logged-in users
router.get('/', withAuth, async (req, res) => {
    try {
        // Fetch posts from the database where the user id matches the session user id
        const postData = await Post.findAll({
            where: {
                userId: req.session.userId
            }
        });

        // Serialize the data so the template can read it
        const userPosts = postData.map((post) => post.get({ plain: true }));

        // Pass serialized data and session flag into template
        res.render('dashboard', {
            layout: 'main',
            userPosts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.redirect('login');
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            res.status(404).send('Post not found');
            return;
        }
        if (post.userId !== req.session.userId) {
            res.status(403).send('Unauthorized to edit this post');
            return;
        }
        res.render('editPost', { post: post.get({ plain: true }), loggedIn: req.session.loggedIn });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// // Update a post by its id value (POST request to match form action)
router.post('/update/:id', withAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const postId = req.params.id;
        const updatedPost = await Post.update(
            { title, content },
            { where: { id: postId, userId: req.session.userId } }
        );

        if (updatedPost[0] > 0) {
            res.redirect('/dashboard');
        } else {
            res.status(404).send('Post not found or you do not have permission to edit.');
        }
    } catch (error) {
        console.error('error updating post:', error);
        res.status(500).send('Server error');
    }
});

router.post('/delete/:id', withAuth, async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedRowCount = await Post.destroy({ where: { id: postId, userId: req.session.userId } });
        if (deletedRowCount === 0) {
            res.status(404).json({ message: 'No post found with this ID' });
            return;
        }
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;