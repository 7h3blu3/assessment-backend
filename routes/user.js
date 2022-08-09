const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const {userRole} = require('../middleware/is-role')

const router = express.Router();

router.get("/start-assessment", isAuth, userController.getStartAssessment)

router.get("/assessment", isAuth, userController.getAssessment)

router.post("/assessment", isAuth, userController.postAssessment)


module.exports = router;
