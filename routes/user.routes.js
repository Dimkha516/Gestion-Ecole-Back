const express = require("express");
const { signIn, logout } = require("../controllers/auth.controller");
const {
  createUser,
  getAllUsers,
  getUserById,
  filterUsersByAttribute,
} = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const router = express.Router();

// AUTHENTIFICATION:
router.post("/login", signIn);
router.post("/logout", logout);

// CRUD USER
router.post("/create", isAuthenticated, createUser);
router.get("/all", isAuthenticated, getAllUsers);
router.get("/getOneUser/:userId", isAuthenticated, getUserById);
router.get("/filters", isAuthenticated, filterUsersByAttribute);
// http://localhost:5000/api/v1/users/filters?attribute=profil&value=admin

module.exports = router;
