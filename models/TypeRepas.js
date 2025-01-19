import mongoose from "../config/mongodb.js";

const TypeRepasSchema = new mongoose.Schema(
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

const TypeRepas = mongoose.model("TypeRepas", TypeRepasSchema);
export default TypeRepas;
