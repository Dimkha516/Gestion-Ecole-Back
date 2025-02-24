const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

//  Vérifier si l'utilisateur est authentifié et stocker ses informations dans res.locals.user.
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log("Token invalid or expired: " + decodedToken);
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        console.log("check user middleware", user._id);
        next();
      }
    });
  } else {
    res.locals.user = null;
    console.log("No existed token");
    next();
  }
};


//Empêcher l'accès aux routes protégées si l'utilisateur n'est pas authentifié.
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        console.log("Token invalid or expired" );
        res.status(400).json("no token");
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.status(404).json({ message: "Invalid Token" });
    console.log("No token");
  }
};

module.exports.isAuthenticated = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).json({
      message: "Veuillez vous connecter d'abord",
    });
  }
  next();
};
