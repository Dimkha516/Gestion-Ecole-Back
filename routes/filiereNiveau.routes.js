const {
  createFiliereNiveau,
  getAllFiliereNiveau,
  addCoursInClasse,
  getClassesByFilters,
  getClasseById,
  getClassCours,
} = require("../controllers/filiereNiveau.controller");

const router = require("express").Router();

router.get("/all", getAllFiliereNiveau);
router.get("/filter", getClassesByFilters);
router.get("/getOneClasse/:classeId", getClasseById);
router.get("/getClassCours/:id", getClassCours);
router.post("/create", createFiliereNiveau);
router.post("/addCours/:id", addCoursInClasse);

module.exports = router;
