const { body, validationResult } = require("express-validator");

const createTeacherValidator = [
  body("prenom")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis.")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Le prénom entré est invalide.")
    .bail()
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage("Le prénom ne doit contenir que des lettres et espaces."),

  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis.")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Le nom doit contenir au moins 2 caractères.")
    .bail()
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres et espaces."),

  body("telephone")
    .trim()
    .notEmpty()
    .withMessage("Le téléphone est requis.")
    .bail()
    .matches(/^(77|78|76|70)[0-9]{7}$/)
    .withMessage(
      "Le téléphone doit contenir 9 chiffres et commencer par 77, 78, 76 ou 70."
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .bail()
    .isEmail()
    .withMessage("L'email doit être valide.")
    .bail()
    .normalizeEmail(),

  body("photo")
    .optional()
    .isURL()
    .withMessage("L'URL de la photo doit être valide."),

  body("coursID")
    .notEmpty()
    .withMessage("Vous devez choisir au moins une spécialité.")
    .bail()
    .isMongoId()
    .withMessage("La spécialité doit être valide."),

    // Middleware pour capturer les erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = createTeacherValidator;
