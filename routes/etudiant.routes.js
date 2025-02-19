const { createEtudiantAndRegisterClasse, getAllStudents, getStudentById, getStudentsByFilters } = require('../controllers/etudiant.controller');
const createStudentValidator = require('../utils/validators/createStudentValidator');

const router = require('express').Router();
router.get('/all', getAllStudents);
router.get('/getById/:id', getStudentById);
router.post("/getByfilters", getStudentsByFilters);
router.post("/create", createStudentValidator, createEtudiantAndRegisterClasse)
module.exports = router;