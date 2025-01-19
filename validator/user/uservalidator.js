import { body, param } from "express-validator";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import ResetLink from "../../models/ResetLink.js";
import validator from "validator";
import Role from "../../models/Role.js";
import FonctionUser from "../../models/Fonction.js";
import { Types } from "mongoose";
const { isUUID } = validator;

export const validateProfil = [
  param("user")
    .notEmpty()
    .withMessage("Aucun utilisateur envoyé")
    .custom(async (value) => {
      const user = await User.findById(value).exec();
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
    }),
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.find({
        email: value,
        _id: { $ne: req.params.user },
      }).exec();
      if (user.length > 0) {
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
      const user = await User.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
        _id: { $ne: req.params.user },
      }).exec();
      if (user.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),

  body("aboutme").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 200) {
        throw new Error(
          "La section à propos ne doit pas dépasser 200 caractères"
        );
      }
    }
  }),

  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),

  body("username")
    .notEmpty()
    .withMessage("Le nom d'utilisateur est obligatoire")
    .isLength({ min: 5 })
    .withMessage("Renseignez au moins 5 caractères")
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.find({
        username: value,
        _id: { $ne: req.params.user },
      }).exec();
      if (user.length > 0) {
        throw new Error("Ce nom d'utilisateur est déjà utilisé");
      }
    }),
];

export const validateUpdatePassword = [
  param("user")
    .notEmpty()
    .withMessage("Aucun utilisateur envoyé")
    .custom(async (value) => {
      const user = await User.findById(value).exec();
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
    }),
  body("old_password")
    .notEmpty()
    .withMessage("Le champ MOT DE PASSE ne peut être vide")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(
      "Le MOT DE PASSE n'est pas fort. Il doit contenir au moins : un caractère spécial, un chiffre, une lettre majuscule, une lettre miniscule"
    )
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.user)
        .select("+password")
        .exec();
      if (!user) {
        throw new Error("Compte non trouvé");
      }
      const result = await bcrypt.compare(value, user.password);
      if (result === false) {
        throw new Error("Votre ancien mot de passe n'est pas correcte");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Le champ MOT DE PASSE ne peut être vide")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(
      "Le MOT DE PASSE n'est pas fort. Il doit contenir au moins : un caractère spécial, un chiffre, une lettre majuscule, une lettre miniscule"
    )
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.user)
        .select("+password")
        .exec();
      if (!user) {
        throw new Error("Compte non trouvé");
      }
      const result = await bcrypt.compare(value, user.password);
      if (result === true) {
        throw new Error(
          "Vous ne pouvez pas utiliser votre ancien mot de passe"
        );
      }
    }),
  body("confirm_password")
    .notEmpty()
    .withMessage("Le champ MOT DE PASSE ne peut être vide")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(
      "Le MOT DE PASSE n'est pas fort. Il doit contenir au moins : un caractère spécial, un chiffre, une lettre majuscule, une lettre miniscule"
    )
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("La confirmation de mot de passe à échouer");
      }
    }),
];

export const validateAdminAddUser = [
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const user = await User.find({ email: value }).exec();
      if (user.length > 0) {
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
      const user = await User.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
      }).exec();
      if (user.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),

  body("aboutme").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 200) {
        throw new Error(
          "La section à propos ne doit pas dépasser 200 caractères"
        );
      }
    }
  }),

  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),

  body("active_account")
    .notEmpty()
    .withMessage("Le status du compte est obligatoire")
    .isBoolean()
    .withMessage("Le status du compte est true ou false"),

  body("role")
    .notEmpty()
    .withMessage("Le role est obligatoire")
    .custom(async (value, { req }) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error("Le role n'existe pas");
      }
      const role = await Role.findOne({ _id: value }).exec();
      if (!role) {
        throw new Error("Le role n'existe pas");
      }
    }),

  body("fonction").custom(async (value, { req }) => {
    if (value) {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error("Le fonction n'existe pas");
      }
      const fonction = await FonctionUser.findOne({
        _id: value,
      }).exec();
      if (!fonction) {
        throw new Error("La fonction n'existe pas");
      }
    }
  }),
];

export const validateAdminUpdateUser = [
  param("user")
    .notEmpty()
    .withMessage("Aucun utilisateur envoyé")
    .custom(async (value) => {
      const user = await User.findById(value).exec();
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
    }),
  body("lastname")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("firstname")
    .notEmpty()
    .withMessage("Le prénom est obligatoire")
    .isLength({ min: 1 })
    .withMessage("Renseignez au moins 2 caractères")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL est obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.find({
        email: value,
        _id: { $ne: req.params.user },
      }).exec();
      if (user.length > 0) {
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
      const user = await User.find({
        $expr: {
          $eq: [{ $concat: ["$code", "$phone"] }, phone],
        },
        _id: { $ne: req.params.user },
      }).exec();
      if (user.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
      }
    }),

  body("country").notEmpty().withMessage("Renseignez le pays"),

  body("aboutme").custom(async (value, { req }) => {
    if (value) {
      const taille = value.length;
      if (taille > 200) {
        throw new Error(
          "La section à propos ne doit pas dépasser 200 caractères"
        );
      }
    }
  }),

  body("website").custom(async (value, { req }) => {
    if (value) {
      const valideUrl = validator.isURL(value);
      if (valideUrl === false) {
        throw new Error("L'url de votre site n'est pas valide");
      }
    }
  }),

  body("active_account")
    .notEmpty()
    .withMessage("Le status du compte est obligatoire")
    .isBoolean()
    .withMessage("Le status du compte est true ou false"),

  body("role")
    .notEmpty()
    .withMessage("Le role est obligatoire")
    .custom(async (value, { req }) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error("Le role n'existe pas");
      }
      const role = await Role.findOne({ _id: value }).exec();
      if (!role) {
        throw new Error("Le role n'existe pas");
      }
    }),

  body("fonction").custom(async (value, { req }) => {
    if (value) {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error("Le fonction n'existe pas");
      }
      const fonction = await FonctionUser.findOne({
        _id: value,
      }).exec();
      if (!fonction) {
        throw new Error("La fonction n'existe pas");
      }
    }
  }),

  body("username")
    .notEmpty()
    .withMessage("Le nom d'utilisateur est obligatoire")
    .escape()
    .custom(async (value, { req }) => {
      const username = value.replace(/\s+/g, "");
      if (username.length < 5 || username.length > 15) {
        throw new Error(
          "Le nom d'utilisateur doit être compris entre 5 et 15 caractères"
        );
      }

      const user = await User.findOne({
        username: username,
        _id: { $ne: req.params.user },
      }).exec();
      if (user) {
        throw new Error("Le nom d'utilisateur existe déjà");
      }
    }),

  body("active_account")
    .notEmpty()
    .withMessage("Le status du compte est obligatoire")
    .isBoolean()
    .withMessage("Le status du compte est true ou false"),
];

export const validateAdminUpdateStatus = [
  param("user")
    .notEmpty()
    .withMessage("Aucun utilisateur envoyé")
    .custom(async (value) => {
      const user = await User.findById(value).exec();
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
    }),
  body("active_account")
    .notEmpty()
    .withMessage("Le status du compte est obligatoire")
    .isBoolean()
    .withMessage("Le status du compte est true ou false"),
];

export const validateAdminGeneratePassword = [
  param("user")
    .notEmpty()
    .withMessage("Aucun utilisateur envoyé")
    .custom(async (value) => {
      const user = await User.findById(value).exec();
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
    }),
];
