import mongoose from "../config/mongodb.js";
import TypeRepas from "../models/TypeRepas.js";

const TypeRepasSeeder = async () => {
  const model = mongoose.model("TypeRepas");
  const data = [
    { libelle: "Petit déjeuner" },
    { libelle: "Déjeuner" },
    { libelle: "Dîner" },
    { libelle: "Boissons" },
    { libelle: "Brunch" },
    { libelle: "Desserts" },
    { libelle: "Thé ou Café" },
    { libelle: "Collations" },
    { libelle: "Boissons" },
    { libelle: "Tard le soir" },
    { libelle: "Autre" },
  ];

  if (model) {
    const result = await TypeRepas.insertMany(data);
    if (result) {
      console.log("TypeRepasSeeder effectué");
    } else {
      console.log("TypeRepas Model non trouvé");
    }
  }
};
export default TypeRepasSeeder;
