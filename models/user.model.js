const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: [true, "Le prénom est requis"],
    trim: true,
  },
  nom: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    minlength: 6,
  },
  profil: {
    type: String,
    enum: [
      "admin",
      "enseignant",
      "etudiant",
      "respoPedago",
      "secretaire",
      "surveillant",
      "caissier",
    ],
    required: [true, "Le profil utilisateur est requis"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: [true, "ID admin obligatoire"],
  },
  lastConnexion: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw new Error('password incorrect');
    }
    throw new Error('email incorrect');
}

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
