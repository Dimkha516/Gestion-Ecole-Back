const Joi = require("joi");

const createUserValidator = Joi.object({
  prenom: Joi.string().trim().required().messages({
    "string.empty": "Le prénom est requis",
    "any.required": "Le prénom est requis",
  }),
  nom: Joi.string().trim().required().messages({
    "string.empty": "Le nom est requis",
    "any.required": "Le nom est requis",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.empty": "L'email est requis",
    "any.required": "L'email est requis",
    "string.email": "L'email doit être valide"
  }),
  password: Joi.string().min(6).max(1024).required().messages({
    "string.empty": "Le mot de passe est requis",
    "any.required": "Le mot de passe est requis",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "string.max": "Le mot de passe ne peut pas dépasser 1024 caractères",
  }),
  profil: Joi.string()
    .valid(
      "admin",
      "enseignant",
      "etudiant",
      "respoPedago",
      "secretaire",
      "surveillant",
      "caissier"
    )
    .required()
    .messages({
      "any.only": "Profil invalide",
      "string.empty": "Le profil utilisateur est requis",
      "any.required": "Le Profil est requis",
    }),
  createdBy: Joi.string().required().messages({
    "string.empty": "ID admin obligatoire",
  }),

  // status: Joi.string().valid("active", "inactive").default("active"),
  // lastConnexion: Joi.date().allow(null),
  // createdAt: Joi.date().default(() => new Date(), "date actuelle"),
});

module.exports = createUserValidator;
