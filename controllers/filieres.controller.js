const FiliereModel = require("../models/filiere.model");
const NiveauAcademicModel = require("../models/niveauxAcademic.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createFiliere = async (req, res) => {
  const { nom, niveaux } = req.body;
  try {
    // Vérifier si une filière avec le même nom existe déjà
    const existingFiliere = await FiliereModel.findOne({ nom });
    if (existingFiliere) {
      return res.status(400).json({
        message: "Une filière avec ce nom existe déjà",
      });
    }

    // Vérifier si tous les IDs de niveaux sont valides
    if (!Array.isArray(niveaux) || niveaux.length === 0) {
      return res.status(400).json({
        message:
          "La liste des niveaux est requise et doit être un tableau non vide",
      });
    }

    // Vérifier les doublons dans le tableau des niveaux
    const uniqueNiveaux = [...new Set(niveaux)];
    if (uniqueNiveaux.length !== niveaux.length) {
      return res.status(400).json({
        message: "Des niveaux en double ont été détectés",
      });
    }

    // Vérifier si tous les niveaux existent dans la base de données
    const existingNiveaux = await NiveauAcademicModel.find({
      _id: { $in: niveaux },
    });

    if (existingNiveaux.length !== niveaux.length) {
      return res.status(400).json({
        message: "Certains IDs de niveaux sont invalides",
      });
    }

    // Créer la filière
    const newFiliere = await FiliereModel.create({
      nom: nom.trim(),
      niveaux: uniqueNiveaux,
    });

    // Retourner la filière créée avec les niveaux peuplés
    const filiereWithNiveaux = await FiliereModel.findById(newFiliere._id)
      .populate("niveaux")
      .exec();

    res.status(201).json({
      message: "Filière créée avec succès",
      filiere: filiereWithNiveaux,
    });
  } catch (err) {
    console.error("Erreur lors de la création de la filière:", err);
    res.status(500).json({
      message: "Erreur lors de la création de la filière",
      error: err.message,
    });
  }
};

module.exports.getAllFilieres = async (req, res) => {
  try {
    const allFilieres = await FiliereModel.find().populate("niveaux").exec();
    res.status(200).json({ allFilieres });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des filières" });
  }
};

module.exports.getOneFiliere = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    const filiere = await FiliereModel.findById(req.params.id)
      .populate("niveaux")
      .exec();
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    res.status(200).json(filiere);
  } catch (err) {
    res.status(404).json({ message: "Filière non trouvée" });
  }
};

module.exports.filterFilieresByAttribute = async (req, res) => {
  const { attribute, value } = req.query;

  try {
    let filteredFilieres;

    // Si l'attribut commence par "niveau.", on cherche dans les niveaux
    if (attribute.startsWith("niveau.")) {
      const niveauAttribute = attribute.split(".")[1];

      // Création de l'expression régulière pour la recherche insensible à la casse
      const searchRegex = new RegExp(value, "i");

      filteredFilieres = await FiliereModel.aggregate([
        // Étape 1: Faire le join avec la collection des niveaux
        {
          $lookup: {
            from: "niveauacademics",
            localField: "niveaux",
            foreignField: "_id",
            as: "niveauxDetails",
          },
        },
        // Étape 2: Déstructurer le tableau niveauxDetails
        {
          $unwind: "$niveauxDetails",
        },
        // Étape 3: Filtrer selon l'attribut du niveau
        {
          $match: {
            [`niveauxDetails.${niveauAttribute}`]: searchRegex,
          },
        },
        // Étape 4: Regrouper les résultats
        {
          $group: {
            _id: "$_id",
            nom: { $first: "$nom" },
            niveaux: { $first: "$niveaux" },
            niveauxDetails: { $push: "$niveauxDetails" },
          },
        },
        // Étape 5: Reformater pour correspondre à la structure attendue
        {
          $project: {
            _id: 1,
            nom: 1,
            niveaux: "$niveauxDetails",
          },
        },
      ]);
    } else {
      // Recherche simple sur les attributs de la filière
      filteredFilieres = await FiliereModel.find({
        [attribute]: new RegExp(value, "i"),
      }).populate("niveaux");
    }

    if (!filteredFilieres || filteredFilieres.length === 0) {
      return res.status(200).json({
        message: "Aucune filière trouvée avec ces critères",
        filteredFilieres: [],
      });
    }

    res.status(200).json({
      message: "Filières trouvées avec succès",
      filteredFilieres,
    });
  } catch (error) {
    console.error("Erreur lors du filtrage des filières:", error);
    res.status(500).json({
      message: "Erreur lors du filtrage des filières",
      error: error.message,
    });
  }
};

// Fonction de validation des IDs
const validateIds = (filiereId, niveauIds) => {
  if (!ObjectID.isValid(filiereId)) {
    throw new Error("ID de filière invalide");
  }

  if (!Array.isArray(niveauIds)) {
    throw new Error("Les IDs des niveaux doivent être fournis dans un tableau");
  }

  niveauIds.forEach((id) => {
    if (!ObjectID.isValid(id)) {
      throw new Error(`ID de niveau invalide: ${id}`);
    }
  });
};

module.exports.addNiveauxAcademic = async (req, res) => {
  try {
    const filiereId = req.params.id;
    const { niveauIds } = req.body; // Attend un tableau d'IDs

    // Validation des IDs
    validateIds(filiereId, niveauIds);

    // Récupération de la filière
    const filiere = await FiliereModel.findById(filiereId);
    if (!filiere) {
      return res.status(404).json({ message: "Filière non trouvée" });
    }

    // Récupération des niveaux à ajouter
    const nouveauxNiveaux = await NiveauAcademicModel.find({
      _id: { $in: niveauIds },
    });

    if (nouveauxNiveaux.length !== niveauIds.length) {
      return res.status(404).json({
        message: "Certains niveaux académiques n'ont pas été trouvés",
      });
    }

    // Vérification des doublons
    const niveauxExistants = nouveauxNiveaux.filter((niveau) =>
      filiere.niveaux.includes(niveau._id)
    );

    if (niveauxExistants.length > 0) {
      return res.status(400).json({
        message: "Certains niveaux sont déjà présents dans la filière",
        niveauxDupliques: niveauxExistants.map((n) => n._id),
      });
    }

    // Ajout des nouveaux niveaux
    filiere.niveaux.push(...nouveauxNiveaux.map((n) => n._id));
    await filiere.save();

    // Récupération de la filière mise à jour avec les niveaux peuplés
    const updatedFiliere = await FiliereModel.findById(filiereId)
      .populate("niveaux")
      .exec();

    res.status(200).json({
      message: "Niveaux académiques ajoutés avec succès à la filière",
      nombreNiveauxAjoutes: nouveauxNiveaux.length,
      filiere: updatedFiliere,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout des niveaux à la filière:", error);
    res.status(error.message.includes("ID") ? 400 : 500).json({
      message: "Erreur lors de l'ajout des niveaux à la filière",
      error: error.message,
    });
  }
};
