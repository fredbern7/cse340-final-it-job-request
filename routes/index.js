const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const passport = require('passport');

router.get('/', (req, res) => {
    //#swagger.tags-['Hello World']
    res.send('Welcome to Final Project..');
});

router.use('/locations', require('./locations'));
router.use('/users', require('./users'));
router.use('/jobrequests', require('./jobrequests'));
router.use('/comments', require('./comments'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    })
})

// router.post('/local/login', userController.loginUser);
// router.post('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to logout' });
//         }
//         res.status(200).json({ message: 'Logout successful' });
//     });
// });
module.exports = router;