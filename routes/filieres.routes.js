const {
  createFiliere,
  getAllFilieres,
  getOneFiliere,
  filterFilieresByAttribute,
  addNiveauAcademic,
  addNiveauxAcademic,
} = require("../controllers/filieres.controller");

const router = require("express").Router();

router.post("/create", createFiliere);
router.get("/all", getAllFilieres);
router.get("/unique/:id", getOneFiliere);
router.get("/filter", filterFilieresByAttribute);
router.post('/addNiveau/:id', addNiveauxAcademic);
module.exports = router;
 