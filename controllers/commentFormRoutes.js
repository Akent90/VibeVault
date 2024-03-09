const express = require('express');
const router = express.Router();
const { Comment, Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.post('/posts/:postId/comments', withAuth, async (req, res) => {
    const { commentText } = req.body;
    const { postId } = req.params;
    const userId = req.session.userId;

    if (!commentText) {
        return res.redirect(`/posts/${postId}?error=Comment text is required`);
    }

    try {
        await Comment.create({
            commentText,
            postId,
            userId,
        });

        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error('Error submitting comment:', error);
        res.redirect(`/posts/${postId}?error=Failed to submit comment`);
    }
});

module.exports = router;