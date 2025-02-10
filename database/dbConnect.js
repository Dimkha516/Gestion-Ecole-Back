const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://" +
        process.env.DB_USER_PASSWORD +
        "@cluster0.b23i7.mongodb.net/",
      {}
    );
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectToDB;

// const cloudDatabase =
//   "mongodb+srv://" +
//   process.env.DB_USER_PASSWORD +
//   "@cluster0.b23i7.mongodb.net/";
//   const localDatabase = process.env.LOCAL_DATABASE;
