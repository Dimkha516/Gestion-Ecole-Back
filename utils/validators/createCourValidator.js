const Joi = require("joi");

const createCoursesValidator = Joi.object({
  libelle: Joi.string().required().messages({
    "string.empty": "Le libellé est obligatoire",
    "any.required": "Le libellé est obligatoire",
    "any.unique": "Le libellé doit être unique",
  }),
});

module.exports = createCoursesValidator;