const CourModel = require("../models/cour.model");
const ProfesseurModel = require("../models/professeur.model");
const generateMatricule = require("../utils/factories/generateMatricule");

const ObjectID = require("mongoose").Types.ObjectId;

// CREATE A NEW PROFESSOR:

module.exports.createTeacher = async (req, res) => {
  const { coursID, prenom, nom, telephone, email } = req.body;

    if (!ObjectID.isValid(coursID)) {
      return res.status(400).json({ message: "ID Cours Invalide" });
    }
    const coursExist = await CourModel.findById({ _id: coursID });
    if (!coursExist) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

  try {
    const matricule = generateMatricule(prenom, nom);
    const newTeacher = await ProfesseurModel.create({
      matricule,
      coursId: coursID,
      prenom,
      nom,
      telephone,
      email,
    });

    const cours = await CourModel.findByIdAndUpdate(
      coursID,
      { $push: { professeurs: newTeacher._id } },
      { new: true }
    );
    if (!cours) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    await newTeacher.save();
    res
      .status(201)
      .json({ message: "Enseignant créé avec succès", teacher: newTeacher });

    res.status(200).json({ teacher: newTeacher });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // Récupérer le champ en erreur (ex: "email" ou "telephone")
      res.status(400).json({ error: `${field} est déjà utilisé.` });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};
