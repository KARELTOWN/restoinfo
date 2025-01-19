import { matchedData, validationResult } from "express-validator";
import generateUsername from "../../helpers/generateUsername.js";
import FileUser from "../../models/FileUser.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import generateStrongPassword from "../../helpers/generatePassword.js";
import mailing from "../../config/mailer.js";

export default function UserController() {
  const changePhoto = async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(500).json({ message: "Aucun fichier uploadé", data: {} });
      }
      console.log("isAuthenticated", req.isAuthenticated());
      const file = req.file;
      const fileuser = await FileUser.create({
        name: file.metadata.original_name,
        path: file.location,
        mimetype: file.contentType,
      });
      if (fileuser) {
        let user = await User.findByIdAndUpdate(req.body.user_id, {
          photo: fileuser._id,
        }).populate("photo");
        res.status(200).json({ message: "Photo modifié", data: user });
      }
    } catch (err) {
      next(err);
    }
  };

  const updateProfil = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        const user = await User.findByIdAndUpdate(result.user, result, {
          new: true,
        });
        res.status(200).json({
          message: "Profil modifié",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const updatePassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const data = matchedData(req);
        const hashPassword = await bcrypt.hash(data.password, 10);
        const user = await User.findByIdAndUpdate(
          req.params.user,
          { password: hashPassword },
          { new: true }
        );
        if (user) {
          res.status(200).json({
            message: "Mot de passe modifié",
            data: user,
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

  const adminAddUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        const password = generateStrongPassword();
        console.log("new password", password);
        const hasckpassword = await bcrypt.hash(password, 10);
        result.password = hasckpassword;
        result.username = await generateUsername(result);
        const user = await User.create(result);
        if (user) {
          mailing(
            result.email,
            "Bienvenue sur RESTO INFO",
            "adminadduser.pug",
            {
              firstname: result.firstname,
              lastname: result.lastname,
              email: result.email,
              password: password,
            }
          );
          res.status(200).json({
            message: "Compte créé avec succès",
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const adminUpdateUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const result = matchedData(req);
        //delete spaces
        result.username = result.username.replace(/\s+/g, "");
        const user = await User.findByIdAndUpdate(result.user, result, {
          new: true,
        }).exec();
        if (user) {
          // mailing(
          //   result.email,
          //   "Bienvenue sur RESTO INFO",
          //   "updateadminuser.pug",
          //   {
          //     firstname: result.firstname,
          //     lastname: result.lastname,
          //   }
          // );
          res.status(200).json({
            message: "Données utilisateur modifiées avec succès",
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const adminUpdateStatus = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty() === false) {
        res.status(422).json({ errors: errors.array() });
      }
      const data = matchedData(req);
      const user = await User.findByIdAndUpdate(
        data.user,
        { active_account: data.active_account },
        { new: true }
      ).exec();
      const statut = data.active_account === true ? "activé" : "désactivé";
      res.status(200).json({
        message: "Compte " + statut,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  const adminGeneratePassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty() === false) {
        res.status(422).json({ errors: errors.array() });
      }
      const result = matchedData(req);
      const password = generateStrongPassword();
      const hashpassword = await bcrypt.hash(password, 10);
      const user = await User.findByIdAndUpdate(
        result.user,
        {
          password: hashpassword,
        },
        { new: true }
      ).exec();
      if (user) {
        mailing(
          user.email,
          "Réinitilisation mot de passe",
          "generatepassword.pug",
          {
            firstname: result.firstname,
            lastname: result.lastname,
            email: result.email,
            password: password,
          }
        );
        res.status(200).json({
          message: "Mot de passe généré avec succès",
          data: user,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  const showUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.user)
        .populate("photo")
        .populate("role")
        .populate("fonction")
        .exec();
      if (user) {
        res.status(200).json({
          message: "Utilisateur récupéré",
          data: user,
        });
      }
      res.status(404).json({
        message: "Utilisateur non trouvé",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  };

  const getUsers = async (req, res, next) => {
    try {
      const users = await User.find({})
        .populate("photo")
        .populate("role")
        .populate("fonction")
        .exec();
      res.status(200).json({
        message: "Utilisateurs récupérés",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    changePhoto,
    updateProfil,
    updatePassword,
    adminAddUser,
    adminUpdateStatus,
    adminUpdateUser,
    adminGeneratePassword,
    showUser,
    getUsers,
  };
}
