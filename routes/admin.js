const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const {adminRole, contentManagerRole, reviewerRole} = require('../middleware/is-role')

const router = express.Router();

router.get("/panel", adminController.getPanel)

router.get("/list-users", isAuth ,adminController.getListUsers)
// router.get("/list-users", adminController.getListUsers)

router.get("/archived-users", isAuth, adminController.getListArchivedUsers)

router.get("/edit-users/:userId", isAuth, adminController.getEditUsers)

router.get("/levelMissionType", adminController.getLevelMissionType)
 
router.get("/list-scenarios", isAuth, adminController.getListScenarios)

router.get("/archived-scenarios", adminController.getListArchivedScenarios)

router.get("/assign-scenarios", adminController.getAssignScenarios)

router.get("/user-submission", adminController.getUserSubmission)

router.get("/submission-grade/:userId/:scenarioId", adminController.getSubmissionGrade)

// router.post("/panel", isAuth, adminRole(), adminController.postPanel)

router.post("/edit-users", isAuth, adminController.postEditUsers)

router.post("/levelMissionType", isAuth, adminController.postLevelMissionType)

router.post("/archived-users/:id", isAuth, adminController.postArchivedUsers)

router.post("/restore-users/:id",  isAuth, adminController.postRestoreUsers)

router.post("/delete-user", isAuth, adminController.postDeleteUser)

router.post("/create-scenarios", isAuth, adminController.postcreateScenario)

router.post("/edit-scenarios",  adminController.postEditScenario)

router.post("/archive-scenario/:id", isAuth,  adminController.postArchiveScenario)

router.post("/clone-scenario/:scenarioId", isAuth,  adminController.postCloneScenario)

router.post("/delete-scenario",  adminController.postDeleteScenario)

router.post("/restore-scenario/:id",  isAuth, adminController.postRestoreScenario)

router.post("/assign-scenarios", isAuth, adminController.postAssignScenario)

router.post("/submission-grade/:userId/:scenarioId", isAuth, adminController.postSubmissionGrade)

module.exports = router;
