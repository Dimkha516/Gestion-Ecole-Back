const { getStatistics } = require("../controllers/statistics.controller");

const router = require("express").Router();

router.get("/all", getStatistics);

module.exports = router;
