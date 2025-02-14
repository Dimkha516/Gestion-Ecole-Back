const { default: mongoose } = require("mongoose");
const CourModel = require("../models/cour.model");
const FiliereModel = require("../models/filiere.model");
const FiliereNiveauModel = require("../models/filiereNiveau.model");
const NiveauAcademicModel = require("../models/niveauxAcademic.model");
const ProfesseurModel = require("../models/professeur.model");
const ObjectID = require("mongoose").Types.ObjectId;

// CREATION CLASSE:
module.exports.createFiliereNiveau = async (req, res) => {
  const { filiere, niveau } = req.body;
  if (!ObjectID.isValid(filiere) || !ObjectID.isValid(niveau)) {
    return res.status(400).json({ message: "Filière ou niveau invalide" });
  }

  // Example of how to check if a filiere and niveau exist in the database:
  const filiereExist = await FiliereModel.findById({ _id: filiere });
  const niveauExist = await NiveauAcademicModel.findById({ _id: niveau });
  if (!filiereExist || !niveauExist)
    return res.status(404).json({ message: "Filière ou Niveau non trouvés" });

  // Example of how to check if the filiere and niveau already exist in the filiereNiveau table:
  const filiereNiveauExist = await FiliereNiveauModel.findOne({
    filiere,
    niveau,
  });
  if (filiereNiveauExist)
    return res.status(409).json({ message: "Cette classe existent dejas" });

  try {
    const newFiliereNiveau = await FiliereNiveauModel.create({
      filiere,
      niveau,
    });
    res.status(200).json({ filiereNiveau: newFiliereNiveau });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all CLASSES:
module.exports.getAllFiliereNiveau = async (req, res) => {
  try {
    // const allClasses = await FiliereNiveauModel.find()
    const allClasses = await FiliereNiveauModel.find().select("filiere niveau");
    // .populate("filiere", "nom")
    // .populate("niveau", "nom")
    // .populate("cours", "libelle")
    // .populate("etudiants", "prenom nom")
    // .exec();
    if (allClasses.length === 0) {
      return res.status(404).json({ message: "Aucune classe trouvée" });
    }
    res.status(200).json({ allClasses });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// GET CLASSE BY ID:
module.exports.getClasseById = async (req, res) => {
  const classeId = req.params.classeId;
  if (!ObjectID.isValid(classeId)) {
    return res.status(400).json({ message: "ID Classe invalide" });
  }

  try {
    const classe = await FiliereNiveauModel.findById(classeId);
    if (!classe) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    res.status(200).json({ classe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CLASSES BY FILTERS:
module.exports.getClassesByFilters = async (req, res) => {
  const { filiere, niveau } = req.query;

  try {
    let filterQuery = {};
    if (filiere) {
      // Convertir la chaîne en ObjectId
      filterQuery.filiere = new ObjectID(filiere);
    }
    if (niveau) {
      // Convertir la chaîne en ObjectId
      filterQuery.niveau = new ObjectID(niveau);
    }
    // Si aucun filtre n'est fourni, on renvoie toutes les classes
    const filtredClasses = await FiliereNiveauModel.find(filterQuery)
      .populate("filiere") // Optionnel : pour avoir les détails de la filière
      .populate("niveau") // Optionnel : pour avoir les détails du niveau
      .exec();

    if (filtredClasses.length === 0) {
      return res.status(404).json({
        message: "Aucune classe trouvée avec ces filtres",
        appliedFilters: filterQuery,
      });
    }
    res.status(200).json({
      filtredClasses,
      totalCount: filtredClasses.length,
      appliedFilters: filterQuery,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// AJOUT COURS DANS UNE CLASSE:
module.exports.addCoursInClasse = async (req, res) => {
  try {
    const classId = req.params.id; // ID de la classe pour laquelle on ajoute les cours
    const { cours } = req.body; // Tableau d'objets contenant {coursID, et porfesseursID}

    if (!ObjectID.isValid(classId)) {
      return res.status(400).json({ message: "ID Classe invalide" });
    }

    if (
      !Array.isArray(cours) ||
      !cours.every(
        (item) =>
          mongoose.Types.ObjectId.isValid(item.coursID) &&
          mongoose.Types.ObjectId.isValid(item.professeurID)
      )
    ) {
      return res
        .status(400)
        .json({ message: "Cours ou professeur invalide(s)" });
    }

    // Récupérer la classe
    const classe = await FiliereNiveauModel.findById(classId);
    if (!classe) return res.status(404).json({ message: "Classe non trouvée" });

    for (let { coursID, professeurID } of cours) {
      // Vérifier que le cours existe
      const coursExiste = await CourModel.findById(coursID);
      if (!coursExiste) {
        return res
          .status(404)
          .json({ message: `Cours avec ID ${coursID} non trouvé` });
      }

      // Vérifier que le professeur existe
      const professeurExiste = await ProfesseurModel.findById(professeurID);
      if (!professeurExiste) {
        return res
          .status(404)
          .json({ message: `Professeur avec ID ${professeurID} non trouvé` });
      }
      // Vérifier que le professeur enseigne bien ce cours
      if (!professeurExiste.coursId.includes(coursID)) {
        return res.status(400).json({
          message: `Le professeur ${professeurID} n'enseigne pas le cours ${coursID}`,
        });
      }

      // Vérifier que le cours n'est pas déjà dans la classe avec ce professeur
      const existedCours = classe.cours.some(
        (c) =>
          c.coursID.toString() === coursID.toString() &&
          c.professeurID.toString() === professeurID.toString()
      );

      if (existedCours) {
        return res.status(400).json({
          message: `Le cours ${coursID} est déjà ajouté à la classe avec le professeur ${professeurID}`,
        });
      }

      classe.cours.push({ coursID, professeurID });
    }
    await classe.save();

    // Récupérer la classe mise à jour
    const updatedClasse = await FiliereNiveauModel.findById(classId)
      .populate("filiere", "nom")
      .populate("niveau", "nom")
      .populate("cours.coursID", "libelle")
      .populate("cours.professeurID", "nom prenom")
      .exec();

    res.status(200).json({
      message: "Cours ajoutés avec succès",
      classe: updatedClasse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout des cours",
      error: error.message,
    });
  }
};

// GET ALL COURS OFF CLASSE:
module.exports.getClassCours = async (req, res) => {
  const classId = req.params.id;
  if (!ObjectID.isValid(classId)) {
    return res.status(400).json({ message: "ID Classe invalide" });
  }

  try {
    const classe = await FiliereNiveauModel.findById(classId).populate(
      "cours.coursID",
    )
    if (!classe) return res.status(404).json({ message: "Classe non trouvée" });
    res.status(200).json({ cours: classe.cours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
