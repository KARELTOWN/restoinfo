import { body, param } from "express-validator";
import FileAvis from "../../models/FileAvis.js";
import Restaurant from "../../models/Restaurant.js";
import _ from "lodash";
import Avis from "../../models/Avis.js";
export const validateAddAvis = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
    }),

  body("rating")
    .notEmpty()
    .withMessage("La note est obligatoire")
    .custom(async (value) => {
      let rating = [
        "1",
        "1.5",
        "2",
        "2.5",
        "3",
        "3.5",
        "4",
        "4.5",
        "5",
      ].includes(value);
      if (!rating) {
        throw new Error("Note invalide");
      }
    }),

  body("fichiers")
    .isArray({ min: 1 })
    .withMessage("Uploadez au moins un fichier")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fichiers = await FileAvis.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fichiers.length !== value.length) {
          throw new Error("Certains fichiers n'existent pas");
        }
      }
    }),
  body("contenu").escape(),
];

export const validateEditStatut = [
  param("avis")
    .notEmpty()
    .withMessage("L'identifiant de l'avis est obligatoire")
    .custom(async (value) => {
      const avis = await Avis.findById(value).exec();
      if (!avis) {
        throw new Error("Aucun avis trouvé");
      }
      if (avis.statut == "valider" || avis.statut == "rejeter") {
        throw new Error("Cet avis a déjà validé");
      }
    }),
  body("statut")
    .notEmpty()
    .withMessage("Le statut ne peut être vide")
    .custom(async (value) => {
      const state = ["valider", "rejeter"].includes(value);
      if (!state) {
        throw new Error("Le statut de l'avis n'est pas valide");
      }
    }),
];
