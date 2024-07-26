const express = require('express');
const router = express.Router();
const {isAuthenticated } = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const {checkDuplicateEmail, createCheckLocation, updateCheckLocation, deleteCheck } = require('../middlewares/checkUser');
const {getAll, getSingle, createUser, updateUser, deleteUser } = require('../controllers/users');

router.get('/', getAll);
router.get('/:id', isAuthenticated, getSingle);
router.post('/', checkDuplicateEmail, createCheckLocation, createUser);
router.put('/:id', checkDuplicateEmail, updateCheckLocation, updateUser);
router.delete('/:id', isAuthenticated, deleteCheck, deleteUser);

module.exports = router;
