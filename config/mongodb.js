import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/${process.env.DB_CLUSTER}?retryWrites=true`;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    const connect = await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);
export default mongoose;
