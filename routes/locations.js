
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { checkDuplicateLocation, deleteCheck } = require('../middlewares/checkLocation');
const { getAll, getSingle, createLocation, updateLocation, deleteLocation } = require('../controllers/locations');

router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getSingle);
router.post('/', isAuthenticated, checkDuplicateLocation, createLocation);
router.put('/:id', isAuthenticated, checkDuplicateLocation, updateLocation);
router.delete('/:id', isAuthenticated, deleteCheck, deleteLocation);

module.exports = router;
