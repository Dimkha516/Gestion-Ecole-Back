const NiveauAcademicModel = require("../models/niveauxAcademic.model");

module.exports.createNiveau = async (req, res) => {
  const nom = req.body;

  try {
    const newNiveauAcademic = await NiveauAcademicModel.create(nom);
    res.status(200).json({ niveau: newNiveauAcademic });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
