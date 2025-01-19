import mongoose from "../config/mongodb.js";

const RegimeSchema = new mongoose.Schema(
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

const Regime = mongoose.model("Regime", RegimeSchema);
export default Regime;
