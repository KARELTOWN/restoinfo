import express from "express";
import { configDotenv } from "dotenv";
import router from "./routes/router.js";

import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import pug from "pug";
import mongoose from "./config/mongodb.js";
// import UserConnect from "./helpers/auth.js";
configDotenv();
const app = express();
// app.use(UserConnect);

//Gestionnaire global des erreurs
app.use((error, req, res, next) => {
  console.log("Erreur " + error);
  res.status(500).json({
    message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    error: error.message || error,
  });
});

const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, host, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public/files")));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);

export const viewspath = path.join(__dirname, "views");
export default app;
