const { body, validationResult } = require("express-validator");

const createStudentValidator = [
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
    
  body("dateNaissance")
    .notEmpty()
    .withMessage("La date de naissance est requise.")
    .bail()
    .isISO8601()
    .withMessage("La date de naissance doit être valide (format YYYY-MM-DD)."),

  body("lieuNaissance")
    .trim()
    .notEmpty()
    .withMessage("Le lieu de naissance est requis."),
    

  body("adresse").trim().notEmpty().withMessage("L'adresse est requise."),

  body("sexe")
    .notEmpty()
    .withMessage("Le sexe est requis.")
    .bail()
    .isIn(["M", "F"])
    .withMessage("Le sexe doit être 'M' ou 'F'."),

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

  body("classID")
    .notEmpty()
    .withMessage("La classe est requise.")
    .bail()
    .isMongoId()
    .withMessage("L'ID de la classe doit être valide."),

  body("dateInscription")
    .optional()
    .isISO8601()
    .withMessage("La date d'inscription doit être valide (format YYYY-MM-DD)."),

  body("prenomNomTuteur")
    .trim()
    .notEmpty()
    .withMessage("Le prénom et le nom du tuteur sont requis.")
    .bail()
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage(
      "Le prénom et le nom du tuteur ne doivent contenir que des lettres et espaces."
    ),

  body("telephoneTuteur")
    .trim()
    .notEmpty()
    .withMessage("Le téléphone du tuteur est requis.")
    .bail()
    .matches(/^(77|78|76|70)[0-9]{7}$/)
    .withMessage(
      "Le téléphone du tuteur doit contenir 9 chiffres et commencer par 77, 78, 76 ou 70."
    ),

  // Middleware pour capturer les erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = createStudentValidator;
