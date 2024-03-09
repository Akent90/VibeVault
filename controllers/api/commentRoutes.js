const router = require('express').Router({ mergeParams: true });
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const postId = req.params.postId;

        if (!req.session.userId || !postId || !req.body.commentText) {
            return res.status(400).json({ message: 'Missing comment data or not logged in' });
        }

        const newComment = await Comment.create({
            commentText: req.body.commentText,
            postId: postId, 
            userId: req.session.userId
        });

        res.redirect(`/posts/${postId}`);
    } catch (err) {
        console.error(err);
        res.redirect('/error');
    }
});

module.exports = router;