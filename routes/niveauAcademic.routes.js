const express = require("express");
const { createNiveau } = require("../controllers/niveauAcademic.controller");
const router = express.Router();

router.post("/create", createNiveau);

module.exports = router;
