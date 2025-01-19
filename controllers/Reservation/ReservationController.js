import { matchedData, validationResult } from "express-validator";
import PlanReservation from "../../models/PlanReservation.js";
import Agenda from "../../models/Agenda.js";
import moment from "moment";

export default function ReservationController() {
  const storePlan = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        const plan = await PlanReservation.create(data);
        res.status(200).json({ message: "Plan enregistré", data: plan });
      }
    } catch (err) {
      next(err);
    }
  };

  const storeReservation = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        data.reserved_by = req.user._id;
        const agenda = new Agenda(data);
        const response = await agenda.save();
        if (response) {
          res.status(200).json({
            message:
              "Réservation effectué. Un administrateur devra approuver cette réservation",
            data: response,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  };

  const acceptReservation = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        const agenda = await Agenda.findByIdAndUpdate(
          data.reservation,
          {
            accept_reservation: data.accept_reservation,
            pending: false,
            validated_by: req.user._id,
          },
          { new: true }
        );
        if (agenda) {
          const status =
            data.accept_reservation === true ? "Acceptée" : "Rejetée";
          res.status(200).json({
            message: "Réservation " + status,
            data: agenda,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  };

  const getDisponibilite = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      }
      const data = matchedData(req);
      const agenda = await Agenda.find({ restaurant: data.restaurant }).exec();

      const jour_fermes = agenda
        .filter((element) => element.jour_fermer == true)
        .map((element) => moment(element.date));

      const heures_reserves = agenda
      .filter((element) => element.jour_fermer == null)
      // .map((element)  => {
      //   let data = new Object();
      //   data.date = moment(element.date);
      //   data.heure = element.heure;
      //   return data;
      // });

      const plan = await PlanReservation.findOne({
        restaurant: data.restaurant,
      }).exec();

      res.status(200).json({
        message: "Plan enregistré",
        data: {
          jour_fermes: jour_fermes,
          heures_reserves: heures_reserves,
          plan: plan,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  const closeJourney = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        const plan = await Agenda.create({ ...data, jour_fermer: true });
        res.status(200).json({ message: "Plan enregistré", data: plan });
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    getDisponibilite,
    storePlan,
    storeReservation,
    acceptReservation,
    closeJourney,
  };
}
