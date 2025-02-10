const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { updateUserLastConnexionTime } = require("./user.controller");
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: maxAge,
  });
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ ConnectedUser: user });
    await updateUserLastConnexionTime(user._id);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.signUp = async (req, res) => {
  const { prenom, nom, email, password, profil } = req.body;

  try {
    const newUser = await UserModel.create({
      prenom,
      nom,
      email,
      password,
      profil,
    });
    res.status(200).send({ user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Déconnexion réussie" });
};
