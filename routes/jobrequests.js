const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const {getAll, getSingle, createRequest, updateRequest, deleteRequest} = require('../controllers/jobrequests');

router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getSingle);
router.post('/', isAuthenticated, createRequest);
router.put('/:id', isAuthenticated, updateRequest);
router.delete('/:id', isAuthenticated, deleteRequest);

module.exports = router;