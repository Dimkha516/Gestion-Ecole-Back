const { createCours } = require("../controllers/cours.controller");

const router = require("express").Router();
router.post("/create", createCours);
module.exports = router;
