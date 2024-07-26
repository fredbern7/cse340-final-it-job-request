const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middlewares/authenticate');
const {comment} = require('../middlewares/validate');
const { getAll, getSingle, createComment, updateComment, deleteComment } = require('../controllers/comments');
const {checkRequest} = require('../middlewares/checkComment')

router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getSingle);
router.post('/', isAuthenticated, comment, checkRequest, createComment);
router.put('/:id', isAuthenticated, comment, checkRequest, updateComment);
router.delete('/:id', isAuthenticated, deleteComment);

module.exports = router;