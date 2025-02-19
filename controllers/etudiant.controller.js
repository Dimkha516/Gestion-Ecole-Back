const EtudiantModel = require("../models/etudiant.model");
const FiliereNiveauModel = require("../models/filiereNiveau.model");
const generateMatricule = require("../utils/factories/generateMatricule");

// REGISTER A NEW STUDENT:
module.exports.createEtudiantAndRegisterClasse = async (req, res) => {
  const {
    prenom,
    nom,
    dateNaissance,
    lieuNaissance,
    adresse,
    sexe,
    telephone,
    email,
    classID,
    dateInscription,
    prenomNomTuteur,
    telephoneTuteur,
  } = req.body;

  try {
    const matricule = generateMatricule(prenom, nom);
    const newEtudiant = await EtudiantModel.create({
      matricule,
      prenom,
      nom,
      dateNaissance,
      lieuNaissance,
      adresse,
      sexe,
      telephone,
      email,
      classID,
      dateInscription,
      prenomNomTuteur,
      telephoneTuteur,
      qrCode: "test maty",
    });
    const classe = await FiliereNiveauModel.findByIdAndUpdate(
      classID,
      { $push: { etudiants: newEtudiant._id } },
      { new: true }
    );
    if (!classe) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    await newEtudiant.save();
    res
      .status(201)
      .json({ message: "Étudiant créé avec succès", etudiant: newEtudiant });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // Récupérer le champ en erreur (ex: "email" ou "telephone")
      res.status(400).json({ error: `${field} est déjà utilisé.` });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

// GET ALL STUDENTS:
module.exports.getAllStudents = async (req, res) => {
  try {
    const students = await EtudiantModel.find();
    if (!students) {
      return res.status(404).json({ message: "Aucun étudiant trouvé" });
    }
    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET A STUDENT BY ID:
module.exports.getStudentById = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await EtudiantModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.status(200).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET STUDENTS BY FILIERES:
module.exports.getStudentsByFilters = async (req, res) => {
  const { attributes, value } = req.query;

  try {
    const students = await EtudiantModel.find({ [attributes]: value });
    if (!students) {
      return res.status(404).json({ message: "Aucun étudiant trouvé" });
    }
    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE A STUDENT BY ID:

// CHERCHE STUDENT
