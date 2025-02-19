const CourModel = require("../models/cour.model");
const EudiantModel = require("../models/etudiant.model");
const FiliereModel = require("../models/filiere.model");
const FiliereNiveauModel = require("../models/filiereNiveau.model");
const ProfesseurModel = require("../models/professeur.model");

module.exports.getStatistics = async (req, res) => {
  const totalFilieres = await FiliereModel.countDocuments();
  const totalClasses = await FiliereNiveauModel.countDocuments();
  const totalTeachers = await ProfesseurModel.countDocuments();
  const totalStudents = await EudiantModel.countDocuments();
  const totalCours = await CourModel.countDocuments();
  res.status(200).json({
    totalFilieres,
    totalStudents,
    totalClasses,
    totalTeachers,
    totalCours,
  });
};
