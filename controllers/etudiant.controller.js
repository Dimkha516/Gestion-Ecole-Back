const EtudiantModel = require("../models/etudiant.model");
const FiliereNiveauModel = require("../models/filiereNiveau.model");
const generateMatricule = require("../utils/factories/generateMatricule");


module.exports.registerEtudiantToClasse = async (req, res) => {
  const { etudiantId, classeId } = req.body;
  try {
    const etudiant = await EtudiantModel.findById(etudiantId);
    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }
    const classe = await ClasseModel.findByIdAndUpdate(
      classeId,
      { $push: { etudiants: etudiantId } },
      { new: true }
    );
    if (!classe) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    res
      .status(200)
      .json({ message: "Etudiant inscrit avec succès à la classe" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const matricule = generateMatricule(prenom, nom)
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
      qrCode: "lkdds",
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

// GET A STUDENT BY ID:

// UPDATE A STUDENT BY ID:

// GET STUDENTS BY FILTERS:

// CHERCHE STUDENT
