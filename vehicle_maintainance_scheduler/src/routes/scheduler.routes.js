const express = require("express");

const {
    getOptimizedSchedule
} = require("../controllers/scheduler.controller");

const router = express.Router();

router.get("/schedule", getOptimizedSchedule);

module.exports = router;