import _ from "lodash";
import FileRestaurant from "../../models/FileRestaurant.js";
import Restaurant from "../../models/Restaurant.js";
import mailing from "../../config/mailer.js";
import { emailsAdmin } from "../../config/mailadmin.js";
import { matchedData, validationResult } from "express-validator";

export default function RestaurantController() {
  const uploadRestaurantFiles = async (req, res, next) => {
    try {
      if (_.isArray(req.files) === false) {
        res.status(500).json({ message: "Aucun fichier uploadé", data: {} });
      }
      let files = [];
      for (let file of req.files) {
        let fileuser = await FileRestaurant.create({
          name: file.metadata.original_name,
          path: file.location,
          mimetype: file.contentType,
        });
        files.push(fileuser._id);
      }
      res.status(200).json({ data: files });
    } catch (err) {
      next(err);
    }
  };

  const addFilesTorestaurant = async (req, res, next) => {
    try {
      if (_.isArray(req.files) === false) {
        res.status(500).json({ message: "Aucun fichier uploadé", data: {} });
      }
      let files = [];
      for (let file of req.files) {
        let fileuser = await FileRestaurant.create({
          name: file.metadata.original_name,
          path: file.location,
          mimetype: file.contentType,
        });
        files.push(fileuser._id);
      }
      const data = await Restaurant.findById(req.params.restaurant).exec();
      const all_files = _.concat(data.fichiers, files);
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.restaurant,
        {
          fichiers: all_files,
        },
        { new: true }
      )
        .populate([
          "type_cuisines",
          "type_repas",
          "regimes",
          "fonctionnalites",
          "fichiers",
        ])
        .exec();
      res.status(200).json({
        message: "Fichiers ajoutés au restaurant",
        data: restaurant,
      });
    } catch (err) {
      next(err);
    }
  };

  const createRestaurant = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        const restaurant = await Restaurant.create(data);
        if (restaurant) {
          mailing(
            emailsAdmin,
            "Nouveau restaurant à approuver",
            "newrestaurant.pug",
            {
              denomination: data.denomination,
            }
          );
          res.status(200).json({
            message:
              "Restaurant ajouté avec succès. En attente de validation par les administrateurs",
            data: restaurant,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const acceptRestaurant = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        const restaurant = await Restaurant.findByIdAndUpdate(
          data.restaurant,
          { active_profil: data.accept === true ? true : false },
          { accept: data.accept },
          { new: true }
        ).exec();
        if (restaurant) {
          const statut = data.accept === true ? "Approuvé" : "Rejeté";
          mailing(
            restaurant.email,
            "Restaurant " + statut,
            "approve_restaurant.pug",
            {
              denomination: data.denomination,
              status: data.accept === true ? "approuvé" : "rejeté",
            }
          );
          res.status(200).json({
            message: "Restaurant " + statut,
            data: {},
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const updateRestaurantStatus = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        const restaurant = await Restaurant.findByIdAndUpdate(
          req.params.restaurant,
          { active_profil: data.active_profil },
          { new: true }
        ).exec();
        if (restaurant) {
          mailing(
            restaurant.email,
            "Status du restaurant modifié",
            "edit_status_restaurant.pug",
            {
              denomination: data.denomination,
              status: data.active_profil ? "activé" : "désactivé",
            }
          );
          res.status(200).json({
            message:
              "Restaurant approuvé. En attente de validation par les administrateurs",
            data: user,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  const updateRestaurant = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        let data = matchedData(req);
        const restaurant = await Restaurant.findByIdAndUpdate(
          req.params.restaurant,
          {
            pending_update: true,
            toUpdate: data,
          },
          { new: true }
        ).exec();
        data.restaurant = restaurant.denomination;
        mailing(
          emailsAdmin,
          "Restaurant mise à jour. Veuillez approuver les modifications",
          "update_restaurant.pug",
          {
            denomination: restaurant.denomination,
            data: data,
          }
        );
        res.status(200).json({
          message:
            "Informations enregistrées. En attente de validation par les administrateurs",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const acceptUpdateRestaurant = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        if (data.accept === true) {
          const restoData = await Restaurant.findById(data.restaurant).exec();
          if (restoData.toUpdate !== null) {
            let restaurant = await Restaurant.findByIdAndUpdate(
              data.restaurant,
              { ...restoData.toUpdate, pending_update: false, toUpdate: null },
              {
                new: true,
              }
            ).exec();
            // mailing(
            //   restodata.email,
            //   "Les informations du restaurant sont mises à jour",
            //   "approve_update_restaurant.pug",
            //   {
            //     denomination: data.denomination,
            //   }
            // );
            res.status(200).json({
              message: "Informations enregistrées",
              data: restaurant,
            });
          } else {
            res.status(403).json({
              message: "Aucune modification en attente de validation",
              data: {},
            });
          }
        }
        // mailing(
        //   restodata.email,
        //   "Les informations du restaurant sont mises à jour",
        //   "approve_update_restaurant.pug",
        //   {
        //     denomination: data.denomination,
        //   }
        // );
        res.status(200).json({
          message: "Informations enregistrées",
          data: {},
        });
      }
    } catch (error) {
      next(error);
    }
  };

  const index = async (req, res, next) => {
    const restaurants = await Restaurant.find({})
      .populate([
        "type_cuisines",
        "type_repas",
        "regimes",
        "fonctionnalites",
        "fichiers",
      ])
      .limit(20)
      .exec();
    res.status(200).json({
      message: "Liste des restaurants récupérée",
      data: restaurants,
    });
  };

  const show = async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.restaurant)
      .populate([
        "type_cuisines",
        "type_repas",
        "regimes",
        "fonctionnalites",
        "fichiers",
      ])
      .exec();
    res.status(200).json({
      message: "Restaurant récupéré",
      data: restaurant,
    });
  };

  const getRestaurantData = async (restaurant) => {
    const data = await Restaurant.findById(restaurant)
      .populate([
        "type_cuisines",
        "type_repas",
        "regimes",
        "fonctionnalites",
        "fichiers",
      ])
      .exec();
    return data;
  };

  return {
    uploadRestaurantFiles,
    addFilesTorestaurant,
    createRestaurant,
    updateRestaurant,
    updateRestaurantStatus,
    acceptRestaurant,
    acceptUpdateRestaurant,
    index,
    show,
  };
}
