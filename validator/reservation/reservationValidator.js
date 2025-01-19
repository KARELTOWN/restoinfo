import { body, param } from "express-validator";
import Restaurant from "../../models/Restaurant.js";
import { SchemaTypes } from "mongoose";
import PlanReservation from "../../models/PlanReservation.js";
import moment from "moment";
import Agenda from "../../models/Agenda.js";
import _ from "lodash";
moment.locale("fr");
export const validatePlanReservation = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
      const plan = await PlanReservation.findOne({ restaurant: value }).exec();
      if (plan) {
        throw new Error("Un plan existe déjà pour le restaurant");
      }
    }),
  body("horaires")
    .isArray({ min: 7, max: 7 })
    .withMessage(
      "Les horaires de tous les jours de la semaine doivent être définis"
    ),

  body("intervalle_temps")
    .isNumeric()
    .withMessage("L'intervalle doit être un chiffre"),
  body("limit_persons")
    .isNumeric()
    .withMessage("Le nombre de personnes doit être un chiffre"),
];

export const validateRestaurantParam = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
    }),
];

export const validateAddReservation = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
    }),
  body("date")
    .notEmpty()
    .withMessage("La date est obligatoire")
    .isDate()
    .withMessage("La date n'est pas valide")
    .custom(async (value) => {
      if (moment(value, "YYYY-MM-DD", true).isValid() === true) {
        const date = moment(value, "YYYY-MM-DD", true);
        const today = moment();
        if (date.isBefore(today, "day")) {
          throw new Error("La date ne peut être antérieure à celle du jour");
        }
        const jour_fermer = await Agenda.findOne({
          date: value,
          jour_fermer: true,
        }).exec();
        if (jour_fermer) {
          throw new Error("Impossible de réserver à cette date");
        }
      } else {
        throw new Error("Date au format non valide");
      }
    }),
  body("heure")
    .notEmpty()
    .withMessage("L'heure de la réservation est obligatoire")
    .custom(async (value, { req }) => {
      if (moment(value, "HH:mm", true).isValid()) {
        const plan = await PlanReservation.findOne({
          restaurant: req.params.restaurant,
        });
        const jour =
          moment(req.body.date, "YYYY-MM-DD", true)
            .format("dddd")
            .charAt(0)
            .toUpperCase() +
          moment(req.body.date, "YYYY-MM-DD", true).format("dddd").slice(1);
        const horaire_du_jour = plan.horaires.find(
          (element) => element.jour === jour
        );
        if (horaire_du_jour) {
          const heure_envoye = moment(value, "HH:mm", true);
          if (!horaire_du_jour.start || !horaire_du_jour.end) {
            throw new Error(
              "Les horaires du " +
                jour +
                " ne sont pas définis. Il semble que le restaurant n'ouvre pas ce jour"
            );
          }
          const heure_debut = moment(horaire_du_jour.start, "HH:mm", true);
          const heure_fin = moment(horaire_du_jour.end, "HH:mm", true);
          if (!heure_envoye.isValid()) {
            throw new Error("Heure au format non valide");
          }
          if (
            heure_envoye.isBefore(heure_debut) ||
            heure_envoye.isAfter(heure_fin)
          ) {
            throw new Error("L'heure de réservation n'est pas correcte");
          }

          const date = moment(req.body.date, "YYYY-MM-DD", true);
          const today = moment();
          if (date.isValid()) {
            if (date.isSame(today, "day")) {
              const heure_actuel = moment();
              if (heure_envoye.isBefore(heure_actuel)) {
                throw new Error(
                  "Une heure antérieure à l'heure du jour ne peut être acceptée"
                );
              }
            }
          } else {
            throw new Error("Date au format non valide");
          }

          // const agenda_du_jour = await Agenda.findOne({
          //   date: req.body.date,
          //   heure: value,
          // }).exec();
          // if (agenda_du_jour) {
          //   if (
          //     agenda_du_jour.pending === true ||
          //     (agenda_du_jour.pending === false &&
          //       agenda_du_jour.accept_reservation === false)
          //   ) {
          //     throw new Error("Impossible de réserver. Déjà occupé");
          //   }
          // }
        } else {
          throw new Error("Aucun plan de réservation défini pour le " + jour);
        }
      } else {
        throw new Error("Date au format non valide");
      }
    }),
  body("persons")
    .notEmpty()
    .withMessage("Le nombre de personnes est obligatoire")
    .escape()
    .custom(async (value, { req }) => {
      const plan = await PlanReservation.findOne({
        restaurant: req.params.restaurant,
      });
      if (value > plan.limit_persons) {
        throw new Error(
          "Le nombre de personnes ne doit pas dépasser " + plan.limit_persons
        );
      }
    }),

  body("raison").custom(async (value) => {
    if (value) {
      if (!_.isString(value)) {
        throw new Error("La raison doit être une chaine de caractère");
      }
      if (value.length >= 500) {
        throw new Error("La raison ne doit pas dépasser 500 caracrtères");
      }
    } else {
      throw new Error("Raison obligatoire");
    }
  }),
];

export const validateReservation = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
    }),
  body("reservation")
    .notEmpty()
    .withMessage("La réservation est obligatoire")
    .custom(async (value, { req }) => {
      const agenda = await Agenda.findById(value).exec();
      if (!agenda) {
        throw new Error("Aucune réservation trouvée");
      } else {
        const decision =
          agenda.accept_reservation === true ? "Acceptée" : "Rejetée";

        if (agenda.pending == false) {
          throw new Error("Cette réservation a déjà été " + decision);
        }
      }
    }),
  body("accept_reservation")
    .isBoolean()
    .withMessage("Le status de la réservation doit être true ou false"),
];

export const validateCloseJourney = [
  param("restaurant")
    .notEmpty()
    .withMessage("L'identifiant du restaurant est obligatoire")
    .custom(async (value) => {
      const resto = await Restaurant.findById(value).exec();
      if (!resto) {
        throw new Error("Aucun restaurant trouvé");
      }
    }),
  body("date")
    .isDate()
    .withMessage("Une date doit être envoyée")
    .custom(async (value, { req }) => {
      const validDate = moment(value).isValid();
      if (!validDate) {
        throw new Error("La date n'est pas valide");
      }
    }),
];
