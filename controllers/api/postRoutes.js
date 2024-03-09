const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');
const commentRoutes = require('./commentRoutes');

// Get all posts 
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll();
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a new post 
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            userId: req.session.userId,
        });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete a post 
router.post('/delete/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                userId: req.session.userId,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.use('/:postId/comments', commentRoutes);

module.exports = router;