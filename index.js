const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env" });
const connectToDB = require("./database/dbConnect");
// const cors = require("cors");
const { checkUser, requireAuth } = require("./middlewares/auth.middleware");

const userRoutes = require("./routes/user.routes");
const niveauAcademicRoutes = require("./routes/niveauAcademic.routes");
const filieresRoutes = require("./routes/filieres.routes");
const coursesRoutes = require("./routes/cours.routes");
const filiereNiveauRoutes = require("./routes/filiereNiveau.routes");
const studentsRoutes = require('./routes/etudiant.routes');
const teachersRoutes = require('./routes/professeurs.routes');
const app = express();

// Cors Options:

// BodyParser and CookieParser:

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// JWT:
// app.get('*', checkUser);
app.use("*", checkUser);
app.get("/jwt", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id);
});

// ROUTES:
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/niveauAcademic", niveauAcademicRoutes);
app.use("/api/v1/filieres", filieresRoutes);
app.use("/api/v1/cours", coursesRoutes);
app.use("/api/v1/classes", filiereNiveauRoutes);
app.use("/api/v1/students", studentsRoutes);
app.use("/api/v1/teachers", teachersRoutes);



// SERVER
connectToDB();
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
