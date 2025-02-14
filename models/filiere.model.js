const mongoose = require("mongoose");

const filiereSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom de la filière est requis"],
    trim: true,
  },
  niveaux: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "niveauacademics",
      required: [true, "Le niveau academic est requis"], 
    },
  ],
});

const FiliereModel = mongoose.model("filieres", filiereSchema);

module.exports = FiliereModel;
 