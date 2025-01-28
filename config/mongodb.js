import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/${process.env.DB_CLUSTER}?retryWrites=true`;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  const maxRetries = 3; // Nombre maximum de tentatives
  let retryCount = 0; // Compteur de tentatives

  while (retryCount < maxRetries) {
    try {
      const connect = await mongoose.connect(uri, clientOptions);
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("Connexion réussie à MongoDB!");
      break; // Sort de la boucle si la connexion réussit
    } catch (error) {
      retryCount++;
      console.error(
        `Erreur de connexion à MongoDB (Tentative ${retryCount}/${maxRetries}):`,
        error.message
      );
      setTimeout(() => {
        console.log("En attente du prochain essai");
      }, 1000);
      if (retryCount >= maxRetries) {
        console.error("Nombre maximum de tentatives atteint");
        // process.exit(1);
      }
    }
  }
}

run().catch(console.dir);
export default mongoose;
