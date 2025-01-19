import mongoose from "../config/mongodb.js";

const TypeCuisineSchema = new mongoose.Schema(
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

const TypeCuisine = mongoose.model("TypeCuisine", TypeCuisineSchema);
export default TypeCuisine;
