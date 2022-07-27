const express = require('express');

const authController = require('../controllers/auth');

const { alreadyLogged } = require('../middleware/is-role')

const router = express.Router();

router.get("/", alreadyLogged(), authController.getLogin)

router.get('/login', alreadyLogged(), authController.getLogin);

router.get('/signup', authController.getSignup);
// router.get('/signup', alreadyLogged(), authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', alreadyLogged(), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', alreadyLogged(), authController.getReset);

router.post('/reset', alreadyLogged(), authController.postReset);

router.get('/reset/:token', alreadyLogged(), authController.getNewPassword);

router.post('/new-password', alreadyLogged(), authController.postNewPassword);

module.exports = router;
