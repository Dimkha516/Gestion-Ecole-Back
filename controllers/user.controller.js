const { boolean } = require("joi");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const createUserValidator = require("../utils/validators/createUserValidator");

module.exports.createUser = async (req, res) => {
  const { error } = createUserValidator.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));
    return res.status(400).json({ errors: errorMessages });
  }

  const connectedUser = res.locals.user;
  if (connectedUser.profil !== "admin") {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
  }

  const { prenom, nom, email, password, profil } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errors: [{ field: "email", message: "Cet email est déjà utilisé" }],
      });
    }
    const newUser = await UserModel.create({
      prenom,
      nom,
      email,
      password,
      profil,
      createdBy: connectedUser._id,
    });
    res.status(200).json({ createdUser: newUser });
  } catch (error) {
    console.error("Erreur lors de la création d'un utilisateur");
    res.status(401).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  const connectedUser = res.locals.user;
  if (connectedUser.profil !== "admin") {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
  }
  try {
    const allUsers = await UserModel.find({}).select("-password");
    res.status(200).json({ allUsers });
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs");
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports.getUserById = async (req, res) => {
  const connectedUser = res.locals.user;
  if (connectedUser.profil !== "admin") {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
  }

  const userId = req.params.userId;
  if (!ObjectID.isValid(userId)) {
    return res.status(400).json({ message: "L'ID est invalide" });
  }

  try {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur");
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Filter users by attributes

module.exports.filterUsersByAttribute = async (req, res) => {
  const connectedUser = res.locals.user;
  if (connectedUser.profil !== "admin") {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
  }

  const { attribute, value } = req.query;

  try {
    const users = await UserModel.find({ [attribute]: value }).select(
      "-password"
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error("Erreur lors du filtrage des utilisateurs");
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports.updateUserLastConnexionTime = async (_id) => {
  try {
    await UserModel.findOneAndUpdate(
      { _id }, // Correction ici
      { lastConnexion: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la dernière connexion:",
      error
    );
  }
};
