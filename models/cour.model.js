const mongoose = require("mongoose");

const courSchema = new mongoose.Schema({
  libelle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  professeurs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "professeurs", // Associe le cour avec le modèle Professeur
    },
  ],
});

// Middleware pour supprimer les espaces inutiles dans le libellé
courSchema.pre("save", function (next) {
  this.libelle = this.libelle.replace(/\s+/g, " ").trim(); // Remplace plusieurs espaces par un seul
  next();
});
const CourModel = mongoose.model("cours", courSchema);

module.exports = CourModel;
