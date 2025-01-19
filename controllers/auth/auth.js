import express from "express";
import { query, body, validationResult, matchedData } from "express-validator";
import User from "../../models/User.js";
import mailing from "../../config/mailer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import ResetLink from "../../models/ResetLink.js";
import moment from "moment";
import { agentInfo } from "../../helpers/agentInfo.js";
import generateUsername from "../../helpers/generateUsername.js";
import Role from "../../models/Role.js";
configDotenv();
const app = express();

export default function authController() {
  const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_KEY,
      {
        expiresIn: "30d",
      }
    );
    return refreshToken;
  };

  const refreshToken = async (req, res, next) => {
    try {
      jwt.verify(
        req.body.refreshToken,
        process.env.REFRESH_KEY,
        (err, decoded) => {
          if (err) {
            res.status(403).json({ message: "Token expiré" });
          }
          const token = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.SECRET_KEY,
            {
              expiresIn: "2h",
            }
          );
          res
            .status(200)
            .json({ message: "Token généré", data: { token: token } });
        }
      );
    } catch (error) {
      next(error);
    }
  };

  const login = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        const user = await User.findOne({ email: result.email });
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        const refresh_token = generateRefreshToken(user);
        res.status(200).json({
          message: "Connexion réussie",
          data: { user: user, token: token, refreshToken: refresh_token },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const register = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        const hasckpassword = await bcrypt.hash(result.password, 10);
        result.password = hasckpassword;
        result.username = await generateUsername(result);
        const role = await Role.findOne({ libelle: "Utilisateur" }).exec();
        console.log("user name", role.username);
        result.role = role._id;
        const user = await User.create(result);
        if (user) {
          mailing(result.email, "Bienvenue sur RESTO INFO", "newuser.pug", {
            firstname: result.firstname,
            lastname: result.lastname,
            email: result.email,
          });
          res.status(200).json({
            message: "Compte créé",
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const forgotPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const { email } = req.params;
        const user = await User.findOne({ email: email });
        const devicedata = agentInfo(req);
        const lastlink = await ResetLink.findOne({
          email: email,
        })
          .sort({ created_at: -1 })
          .exec();
        if (lastlink) {
          const expired = await lastlink.isExpired();
          if (!expired) {
            res.status(200).json({
              message: "Un lien de réinitialisation vous a déjà été envoyé",
            });
          }
        }
        let toSave = new ResetLink({
          expiration: moment(),
          email: email,
          device: devicedata,
        });
        let result = await toSave.save();
        const link =
          process.env.FRONT_URL + "/reset-password?" + "urpi=" + result.code;

        const reject =
          process.env.FRONT_URL +
          "/desapprouve-reinitialisation?" +
          "e=" +
          email;

        console.log("url formé", link);
        mailing(
          result.email,
          "Réinitialisation de mot de passe",
          "forgotpassword.pug",
          {
            firstname: user.firstname,
            lastname: user.lastname,
            email: email,
            link: link,
            reject: reject,
          }
        );
        res.status(200).json({
          message: "Mail de réinitialisation envoyé",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const desapprove = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const result = await ResetLink.findOne({
          email: req.params.email,
          code: req.body.code,
        }).exec();
        if (result) {
          const expired = await result.isExpired();
          if (expired) {
            res.status(403).json({
              message:
                "Annulation échouée. Envoyez nous une requête si vous rencontrez un problème avec votre compte",
            });
          } else {
            await result.updateOne({
              expiration: moment().subtract(1, "hour").toDate(),
            });
            res.status(200).json({
              message: "Annulation effectuée",
              data: {},
            });
          }
        } else {
          res.status(403).json({
            message: "Le lien de réinitialisation n'est pas valide",
            data: {},
          });
        }
      } else {
        res
          .status(422)
          .json({ message: "Erreur de validation", errors: errors.array() });
      }
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);
        const link = await ResetLink.findOne({
          code: data.code,
          email: req.params.email,
        }).exec();
        if (link) {
          const expired = await link.isExpired();
          if (expired === true) {
            res.status(403).json({
              message: "Le lien de réinitialisation a expiré",
              data: {},
            });
          }
          const hashPassword = await bcrypt.hash(data.password, 10);
          const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { password: hashPassword },
            { new: true }
          );
          await link.updateOne({
            expiration: moment().subtract(1, "hour").toDate(),
          });
          if (user) {
            res.status(200).json({
              message: "Mot de passe réinitialisé",
              data: user,
            });
          }
        } else {
          res.status(403).json({
            message: "Le lien de réinitialisation n'est pas valide",
            data: {},
          });
        }
      } else {
        res
          .status(422)
          .json({ message: "Erreur de validation", errors: errors.array() });
      }
    } catch (error) {
      next(error);
    }
  };

  return {
    forgotPassword,
    login,
    register,
    refreshToken,
    desapprove,
    resetPassword,
  };
}
