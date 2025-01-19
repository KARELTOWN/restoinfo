import mongoose from "../config/mongodb.js";
import Regime from "../models/Regime.js";

const RegimeSeeder = async () => {
  const model = mongoose.model("Regime");
  const data = [
    { libelle: "Convient aux végétariens" },
    { libelle: "Options végétaliennes" },
    { libelle: "Options sans Gluten" },
  ];

  if (model) {
    const result = await Regime.insertMany(data);
    if (result) {
      console.log("RegimeSeeder effectué");
    }
  } else {
    console.log("Regime Model non trouvé");
  }
};
export default RegimeSeeder;
