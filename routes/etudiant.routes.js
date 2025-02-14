const { createEtudiantAndRegisterClasse } = require('../controllers/etudiant.controller');
const createStudentValidator = require('../utils/validators/createStudentValidator');

const router = require('express').Router();
router.post("/create", createStudentValidator, createEtudiantAndRegisterClasse)
module.exports = router;