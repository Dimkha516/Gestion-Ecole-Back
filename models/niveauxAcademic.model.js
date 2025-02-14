const mongoose = require("mongoose");

const niveauSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le libellé du niveau académic est requis"],
    unique: true,
  },
});

const NiveauAcademicModel = mongoose.model('niveauacademics', niveauSchema);

module.exports = NiveauAcademicModel;