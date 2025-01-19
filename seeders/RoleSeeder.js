import mongoose from "../config/mongodb.js";
import Role from "../models/Role.js";

const RoleSeeder = async () => {
  const model = mongoose.model("Role");
  const data = ["Administrateur", "Utilisateur"];
  if (model) {
    for (let element of data) {
      const result = await Role.findOne({ libelle: element });
      if (!result) {
        await Role.create({ libelle: element });
      }
    }
  } else {
    console.log("Role Model non trouvé");
  }
};
export default RoleSeeder;
