const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const {adminRole, contentManagerRole, reviewerRole} = require('../middleware/is-role')

const router = express.Router();

router.get("/panel", adminController.getPanel)

router.get("/list-users", adminController.getListUsers)

router.get("/archived-users", adminController.getListArchivedUsers)

router.get("/edit-users/:userId", adminController.getEditUsers)

router.get("/levelMissionType", adminController.getLevelMissionType)
 
router.get("/list-scenarios", adminController.getListScenarios)

router.get("/archived-scenarios", adminController.getListArchivedScenarios)

router.get("/assign-scenarios", adminController.getAssignScenarios)

router.get("/user-submission", adminController.getUserSubmission)

router.get("/submission-grade/:userId/:scenarioId", adminController.getSubmissionGrade)

// router.post("/panel", isAuth, adminRole(), adminController.postPanel)

router.post("/edit-users", adminController.postEditUsers)

router.post("/levelMissionType", adminController.postLevelMissionType)

router.post("/archived-users/:id", adminController.postArchivedUsers)

router.post("/restore-users/:id",  adminController.postRestoreUsers)

router.post("/delete-user", adminController.postDeleteUser)

router.post("/create-scenarios", adminController.postcreateScenario)

router.post("/edit-scenarios",  adminController.postEditScenario)

router.post("/archive-scenario/:id",  adminController.postArchiveScenario)

router.post("/clone-scenario",  adminController.postCloneScenario)

router.post("/delete-scenario",  adminController.postDeleteScenario)

router.post("/restore-scenario/:id",  adminController.postRestoreScenario)

router.post("/assign-scenarios", adminController.postAssignScenario)

router.post("/submission-grade/:userId/:scenarioId", adminController.postSubmissionGrade)

module.exports = router;
