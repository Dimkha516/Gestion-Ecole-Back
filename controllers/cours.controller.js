const CourModel = require("../models/cour.model");
const createCoursesValidator = require("../utils/validators/createCourValidator");

module.exports.createCours = async (req, res) => {
  const { error } = createCoursesValidator.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));
    return res.status(400).json({ errors: errorMessages });
  }

  const { libelle, description } = req.body;

  try {
    const existingCours = await CourModel.findOne({ libelle });
    if (existingCours) {
      return res.status(400).json({
        errors: [{ field: "libelle", message: "Ce cours existe déjà" }],
      });
    }
    const newCours = await CourModel.create({ libelle, description });
    res.status(200).json({ cours: newCours });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
