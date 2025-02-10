const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env" });
const connectToDB = require("./database/dbConnect");
// const cors = require("cors");
const { checkUser, requireAuth } = require("./middlewares/auth.middleware");
const userRoutes = require("./routes/user.routes");

const app = express();

connectToDB();

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

// SERVER
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
