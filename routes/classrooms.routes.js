const {
  createClassroom,
  getAllClassrooms,
} = require("../controllers/classrooms.controller");

const router = require("express").Router();

router.get("/all", getAllClassrooms);
router.post("/create", createClassroom);

module.exports = router;
