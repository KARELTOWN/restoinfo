import mongoose from "../config/mongodb.js";
import FonctionnaliteResto from "../models/FonctionnalitesResto.js";

const FonctionnaliteRestoSeeder = async () => {
  const model = mongoose.model("FonctionnaliteResto");
  const data = [
    { libelle: "Accessible en fauteuil roulant" },
    { libelle: "Accepte les animaux" },
    { libelle: "American Express accepté" },
    { libelle: "Bar complet" },
    { libelle: "Bières & vins" },
    { libelle: "Bornes de recharges pour véhicules électriques" },
    { libelle: "Cartes bancaires acceptées" },
    { libelle: "Chaises hautes disponibles" },
    { libelle: "Chèques cadeaux disponibles" },
    { libelle: "Mastercard accepté" },
    { libelle: "Parking" },
    { libelle: "Parking privé gratuit" },
    { libelle: "Prises électriques pour recharge téléphones" },
    { libelle: "Places assises" },
    { libelle: "Plats à emporter" },
    { libelle: "Réservations" },
    { libelle: "Restaurant non-fumeurs" },
    { libelle: "Restaurant fumeurs" },
    { libelle: "Salles privées" },
    { libelle: "Sert de l'alcool" },
    { libelle: "Service de table" },
    { libelle: "Service de voiturier" },
    { libelle: "Stationnement dans la rue" },
    { libelle: "Stationnement clientèles" },
    { libelle: "Terrasse" },
    { libelle: "Carte Visa acceptée" },
    { libelle: "Wi-Fi gratuit" },
  ];

  if (model) {
    const result = await FonctionnaliteResto.insertMany(data);
    if (result) {
      console.log("FonctionnaliteRestoSeeder effectué");
    }
  } else {
    console.log("FonctionnaliteResto Model non trouvé");
  }
};
export default FonctionnaliteRestoSeeder;
