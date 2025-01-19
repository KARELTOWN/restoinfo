import { body, param } from "express-validator";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import ResetLink from "../../models/ResetLink.js";
import validator from "validator";
const { isUUID } = validator;
export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Le champ EMAIL ne peut être vide")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
        .select("+password")
        .exec();
      console.log("user", user);
      if (user) {
        const isPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (isPassword === true) {
        } else {
          throw new Error("Identifiants incorrectes");
        }
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
    .escape(),
];

export const validateRegister = [
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
      const user = await User.find({ email: phone }).exec();
      if (user.length > 0) {
        throw new Error("Ce téléphone est déjà utilisé");
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
    .escape(),
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

export const validateForgotPassword = [
  param("email")
    .notEmpty()
    .withMessage("EMAIL obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ email: value }).exec();
      if (!user) {
        throw new Error("Compte non trouvé");
      }
    }),
];

export const validateResetPassword = [
  param("email")
    .notEmpty()
    .withMessage("EMAIL obligatoire")
    .isEmail()
    .withMessage("EMAIL invalide")
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ email: value }).exec();
      if (!user) {
        throw new Error("Compte non trouvé");
      }
    }),
  body("code")
    .notEmpty()
    .custom(async (value) => {
      if (!isUUID(value)) {
        throw new Error("Le code fourni n'est pas un UUID valide");
      }
      const user = await ResetLink.findOne({ code: value }).exec();
      if (!user) {
        throw new Error("Le lien de réinitialisation n'est pas valide");
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
      const user = await User.findOne({ email: req.params.email })
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
