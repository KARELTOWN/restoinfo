import express from "express";
import {
  validatePlanReservation,
  validateRestaurantParam,
  validateAddReservation,
  validateReservation,
  validateCloseJourney,
} from "../../validator/reservation/reservationValidator.js";
import ReservationController from "../../controllers/Reservation/ReservationController.js";
const {
  getDisponibilite,
  storePlan,
  storeReservation,
  acceptReservation,
  closeJourney,
} = ReservationController();
const ReservationRouter = express.Router();
ReservationRouter.put("/plan/:restaurant", validatePlanReservation, storePlan);
ReservationRouter.put("/update-plan/:restaurant", validatePlanReservation);
ReservationRouter.put(
  "/reserver/:restaurant",
  validateAddReservation,
  storeReservation
);
ReservationRouter.put(
  "/accept-reservation/:restaurant",
  validateReservation,
  acceptReservation
);

ReservationRouter.put(
  "/close-journey/:restaurant",
  validateCloseJourney,
  closeJourney
);
ReservationRouter.get(
  "/disponibilite/:restaurant",
  validateRestaurantParam,
  getDisponibilite
);

export default ReservationRouter;
