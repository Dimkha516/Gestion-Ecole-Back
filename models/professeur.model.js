const mongoose = require("mongoose");
const { isEmail } = require("validator");

const professeurSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  coursId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cours",
      required: true,
    },
  ],
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "L'adresse email est invalide"],
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/dytchfsin/image/upload/v1725810785/clients_photos/Madame_1725810784.png",
  },
  nombreHeures: {
    type: Number,
    required: true,
    min: 0,
    max: 240,
    default: 0,
  },
});

const ProfesseurModel = mongoose.model("professeurs", professeurSchema);
module.exports = ProfesseurModel