import mongoose from "../config/mongodb.js";

const FonctionUserSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: true,
    },
    is_unique: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FonctionUser = mongoose.model("FonctionUser", FonctionUserSchema);
export default FonctionUser;
