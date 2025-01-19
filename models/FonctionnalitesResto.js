import mongoose from "../config/mongodb.js";

const FonctionnaliteRestoSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const FonctionnaliteResto = mongoose.model(
  "FonctionnaliteResto",
  FonctionnaliteRestoSchema
);
export default FonctionnaliteResto;
