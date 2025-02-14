const mongoose = require("mongoose");
const { isEmail } = require("validator");
const etudiantSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
  },
  dateNaissance: {
    type: Date,
    required: true,
  },
  lieuNaissance: {
    type: String,
    required: true,
    trim: true,
  },
  adresse: {
    type: String,
    required: true,
    trim: true,
  },
  sexe: {
    type: String,
    enum: ["M", "F"],
    required: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    unique: true,
    lowercase: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/dytchfsin/image/upload/v1725810785/clients_photos/Madame_1725810784.png",
  },
  classID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "filierniveau",
    required: true,
  },
  dateInscription: {
    type: Date,
    required: true,
    default: Date.now,
  },
  qrCode: {
    type: String,
    // required: true,
    // unique: true,
    // default: () => Math.random().toString(36).substr(2, 9),
  },
  statut: {
    type: String,
    enum: ["actif", "suspendu", "renvoye", "sansNouvelle"],
    required: true,
    default: "actif",
  },
  etatPaiement: {
    type: String,
    enum: ["paye", "nonPaye", "enAttente"],
    required: true,
    default: "enAttente",
  },
  prenomNomTuteur: {
    type: String,
    required: true,
    trim: true,
  },
  telephoneTuteur: {
    type: String,
    required: true,
    trim: true,
  },
});

const EudiantModel = mongoose.model("etudiants", etudiantSchema);

module.exports = EudiantModel;
