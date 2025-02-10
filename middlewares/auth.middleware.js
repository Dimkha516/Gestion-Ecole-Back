const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await UserModel.findOne(decodedToken._id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(400).json("no toke");
      } else {
        console.log(decodedToken._id);
        next();
      }
    });
  } else {
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
