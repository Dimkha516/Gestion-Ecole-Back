const express = require("express");
const { signIn, logout, fakeLogin } = require("../controllers/auth.controller");
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
router.post("/fakelogin", fakeLogin);

// CRUD USER
router.post("/create", createUser);

router.get("/all", getAllUsers);

router.get("/getOneUser/:userId", getUserById);
router.get("/filters",filterUsersByAttribute);
// http://localhost:5000/api/v1/users/filters?attribute=profil&value=admin

module.exports = router;

// router.get("/all", isAuthenticated, getAllUsers);
// router.get("/getOneUser/:userId", isAuthenticated, getUserById);
// router.post("/create", isAuthenticated, createUser);
// router.get("/filters", isAuthenticated, filterUsersByAttribute);