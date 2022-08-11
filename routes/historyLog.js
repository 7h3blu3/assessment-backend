const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const historyLogController = require("../controllers/historyLog");

router.get("/history-log", isAuth, historyLogController.getHistoryLog)

router.get("/clear-log", isAuth, historyLogController.clearHistoryLog)

router.post("/history-log", isAuth, historyLogController.postCreateHistoryLog)


module.exports = router;