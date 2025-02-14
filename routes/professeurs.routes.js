const router = require("express").Router();
const { createTeacher } = require("../controllers/professeur.controller");
const createTeacherValidator = require("../utils/validators/createTeacherValidator");

router.post("/create", createTeacherValidator, createTeacher);
module.exports = router;
