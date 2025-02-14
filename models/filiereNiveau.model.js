const mongoose = require("mongoose");

const filiereNiveauSchema = new mongoose.Schema({
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "filieres",
    required: true,
  },
  niveau: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "niveauacademics",
    required: true,
  },
  horaires: String,
  // cours: [{ type: mongoose.Schema.Types.ObjectId, ref: "cours" }],
  cours: [
    {
      coursID: { type: mongoose.Schema.Types.ObjectId, ref: "cours" },
      professeurID: { type: mongoose.Schema.Types.ObjectId, ref: "professeurs" },
    }
  ],
  etudiants: [{ type: mongoose.Schema.Types.ObjectId, ref: "etudiants" }],
});

const FiliereNiveauModel = mongoose.model("filierniveau", filiereNiveauSchema);
module.exports = FiliereNiveauModel;
