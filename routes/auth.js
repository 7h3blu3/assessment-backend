const express = require('express');


const router = express.Router();

router.get("/")

router.get('/login');

router.get('/signup');
// router.get('/signup'p);

router.post('/login');

router.post('/signup');

router.post('/logout');

router.get('/reset');

router.post('/reset');

router.get('/reset/:token');

router.post('/new-password');

module.exports = router;
