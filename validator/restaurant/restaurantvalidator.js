import { body, param } from "express-validator";
import validator from "validator";
import Restaurant from "../../models/Restaurant.js";
import FileRestaurant from "../../models/FileRestaurant.js";
import Regime from "../../models/Regime.js";
import TypeCuisine from "../../models/TypeCuisine.js";
import TypeRepas from "../../models/TypeRepas.js";
import FonctionnalitesResto from "../../models/FonctionnalitesResto.js";
import _ from "lodash";

export const validateCreateRestaurant = [
  body("denomination")
    .notEmpty()
    .withMessage("Le nom du restaurant est obligatoire"),
  body("gerant").notEmpty().withMessage("Le gérant est obligatoire"),
  body("proprietaire").notEmpty().withMessage("Le gérant est obligatoire"),
  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),
  body("aboutus").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 1000) {
        throw new Error(
          "La section à propos ne doit pas dépasser 1000 caractères"
        );
      }
    }
  }),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const restaurant = await Restaurant.find({ email: value }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce email est déjà utilisé");
      }
    }),
  body("code").notEmpty().withMessage("Le code pays est obligatoire").escape(),
  body("phone")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire")
    .isLength({ min: 2 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape()
    .custom(async (value, { req }) => {
      const code = req.body.code;
      if (code === "+229") {
        if (value.length !== 10) {
          throw new Error("Le numéro de téléphone du Bénin est de 10 chiffres");
        }
      }
    })
    .custom(async (value, { req }) => {
      const phone = req.body.code + value;
      const restaurant = await Restaurant.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
      }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),
  body("ville").notEmpty().withMessage("Renseignez la ville"),
  body("adress").notEmpty().withMessage("Renseignez l'adresse du restaurant"),
  body("maps")
    .notEmpty()
    .withMessage("Renseignez une localisation MAPS")
    .custom(async (value, { req }) => {
      const valideUrl = validator.isURL(value, {
        require_protocol: true,
        protocols: ["https"],
      });
      if (valideUrl === false) {
        throw new Error("Le lien maps n'est pas valide");
      }
    }),
  body("fichiers")
    .isArray({ min: 1 })
    .withMessage("Uploadez au moins un fichier")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fichiers = await FileRestaurant.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fichiers.length !== value.length) {
          throw new Error("Certains fichiers n'existent pas");
        }
      }
    }),
  body("fonctionnalites")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins une fonctionnalitée")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fonctionnalites = await FonctionnalitesResto.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fonctionnalites.length !== value.length) {
          throw new Error("Certaines fonctionnalités n'existent pas");
        }
      }
    }),
  body("regimes")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un régime")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const regimes = await Regime.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (regimes.length !== value.length) {
          throw new Error("Certains régimes n'existent pas");
        }
      }
    }),
  body("type_repas")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un type de repas")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_repas = await TypeRepas.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_repas.length !== value.length) {
          throw new Error("Certains types de repas n'existent pas");
        }
      }
    }),
  body("type_cuisines")
    .isArray({ min: 5 })
    .withMessage("Choisissez au moins 5 type de cuisines")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_cuisines = await TypeCuisine.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_cuisines.length !== value.length) {
          throw new Error("Certains types de cuisines n'existent pas");
        }
      }
    }),
  body("horaires")
    .isArray({ min: 7, max: 7 })
    .withMessage(
      "Les horaires de tous les jours de la semaine doivent être définis"
    ),
];

export const validateAdminCreateRestaurant = [
  body("denomination")
    .notEmpty()
    .withMessage("Le nom du restaurant est obligatoire"),
  body("gerant").notEmpty().withMessage("Le gérant est obligatoire"),
  body("proprietaire").notEmpty().withMessage("Le gérant est obligatoire"),
  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),
  body("aboutus").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 1000) {
        throw new Error(
          "La section à propos ne doit pas dépasser 1000 caractères"
        );
      }
    }
  }),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const restaurant = await Restaurant.find({ email: value }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce email est déjà utilisé");
      }
    }),
  body("code").notEmpty().withMessage("Le code pays est obligatoire").escape(),
  body("phone")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire")
    .isLength({ min: 2 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape()
    .custom(async (value, { req }) => {
      const code = req.body.code;
      if (code === "+229") {
        if (value.length !== 10) {
          throw new Error("Le numéro de téléphone du Bénin est de 10 chiffres");
        }
      }
    })
    .custom(async (value, { req }) => {
      const phone = req.body.code + value;
      const restaurant = await Restaurant.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
      }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),
  body("ville").notEmpty().withMessage("Renseignez la ville"),
  body("adress").notEmpty().withMessage("Renseignez l'adresse du restaurant"),
  body("maps")
    .notEmpty()
    .withMessage("Renseignez une localisation MAPS")
    .custom(async (value, { req }) => {
      const valideUrl = validator.isURL(value, {
        require_protocol: true,
        protocols: ["https"],
      });
      if (valideUrl === false) {
        throw new Error("Le lien maps n'est pas valide");
      }
    }),
  body("fichiers")
    .isArray({ min: 1 })
    .withMessage("Uploadez au moins un fichier")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fichiers = await FileRestaurant.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fichiers.length !== value.length) {
          throw new Error("Certains fichiers n'existent pas");
        }
      }
    }),
  body("fonctionnalites")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins une fonctionnalitée")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fonctionnalites = await FonctionnalitesResto.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fonctionnalites.length !== value.length) {
          throw new Error("Certaines fonctionnalités n'existent pas");
        }
      }
    }),
  body("regimes")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un régime")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const regimes = await Regime.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (regimes.length !== value.length) {
          throw new Error("Certains régimes n'existent pas");
        }
      }
    }),
  body("type_repas")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un type de repas")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_repas = await TypeRepas.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_repas.length !== value.length) {
          throw new Error("Certains types de repas n'existent pas");
        }
      }
    }),
  body("type_cuisines")
    .isArray({ min: 5 })
    .withMessage("Choisissez au moins 5 type de cuisines")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_cuisines = await TypeCuisine.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_cuisines.length !== value.length) {
          throw new Error("Certains types de cuisines n'existent pas");
        }
      }
    }),
  body("horaires")
    .isArray({ min: 7, max: 7 })
    .withMessage(
      "Les horaires de tous les jours de la semaine doivent être définis"
    ),
  body("active_profil")
    .isBoolean()
    .withMessage("Le status du restaurant est true ou false"),
];

export const validateUpdateRestaurant = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("denomination")
    .notEmpty()
    .withMessage("Le nom du restaurant est obligatoire"),
  body("gerant").notEmpty().withMessage("Le gérant est obligatoire"),
  body("proprietaire").notEmpty().withMessage("Le gérant est obligatoire"),
  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),
  body("aboutus").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 1000) {
        throw new Error(
          "La section à propos ne doit pas dépasser 1000 caractères"
        );
      }
    }
  }),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value, { req }) => {
      const restaurant = await Restaurant.find({
        email: value,
        _id: { $ne: req.params.restaurant },
      }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce email est déjà utilisé");
      }
    }),
  body("code").notEmpty().withMessage("Le code pays est obligatoire").escape(),
  body("phone")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire")
    .isLength({ min: 2 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape()
    .custom(async (value, { req }) => {
      const code = req.body.code;
      if (code === "+229") {
        if (value.length !== 10) {
          throw new Error("Le numéro de téléphone du Bénin est de 10 chiffres");
        }
      }
    })
    .custom(async (value, { req }) => {
      const phone = req.body.code + value;
      const restaurant = await Restaurant.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
        _id: { $ne: req.params.restaurant },
      }).exec();
      if (restaurant.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),
  body("ville").notEmpty().withMessage("Renseignez la ville"),
  body("adress").notEmpty().withMessage("Renseignez l'adresse du restaurant"),
  body("maps")
    .notEmpty()
    .withMessage("Renseignez une localisation MAPS")
    .custom(async (value, { req }) => {
      const valideUrl = validator.isURL(value, {
        require_protocol: true,
        protocols: ["https"],
      });
      if (valideUrl === false) {
        throw new Error("Le lien maps n'est pas valide");
      }
    }),
];

export const validateUpdateRestaurantFonctionnalite = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("fonctionnalites")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins une fonctionnalitée")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const fonctionnalites = await FonctionnalitesResto.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (fonctionnalites.length !== value.length) {
          throw new Error("Certaines fonctionnalités n'existent pas");
        }
      }
    }),
];

export const validateUpdateRestaurantRegime = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("regimes")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un régime")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const regimes = await Regime.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (regimes.length !== value.length) {
          throw new Error("Certains régimes n'existent pas");
        }
      }
    }),
];

export const validateUpdateRestaurantRepas = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("type_repas")
    .isArray({ min: 1 })
    .withMessage("Ajoutez au moins un type de repas")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_repas = await TypeRepas.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_repas.length !== value.length) {
          throw new Error("Certains types de repas n'existent pas");
        }
      }
    }),
];

export const validateUpdateRestaurantCuisine = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("type_cuisines")
    .isArray({ min: 5 })
    .withMessage("Choisissez au moins 5 type de cuisines")
    .custom(async (value) => {
      if (_.isArray(value)) {
        const type_cuisines = await TypeCuisine.find({
          _id: { $in: value },
        })
          .select("_id")
          .exec();
        if (type_cuisines.length !== value.length) {
          throw new Error("Certains types de cuisines n'existent pas");
        }
      }
    }),
];

export const validateUpdateRestaurantHoraire = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("horaires")
    .isArray({ min: 7, max: 7 })
    .withMessage(
      "Les horaires de tous les jours de la semaine doivent être définis"
    ),
];

export const validateAcceptRestaurant = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("accept")
    .isBoolean()
    .withMessage(
      "Le status du restaurant doit être un booléen (true ou false)"
    ),
];

export const validateUpdateRestaurantStatus = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("active_profil")
    .isBoolean()
    .withMessage(
      "Le status du restaurant doit être un booléen (true ou false)"
    ),
];

export const validateUpdatesRestaurant = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
  body("active_profil")
    .isBoolean()
    .withMessage(
      "Le status du restaurant doit être un booléen (true ou false)"
    ),
];

export const validateRestaurantAddFiles = [
  param("restaurant").custom(async (value) => {
    const resto = await Restaurant.findById(value).exec();
    if (!resto) {
      throw new Error("Aucun restaurant trouvé");
    }
  }),
];
