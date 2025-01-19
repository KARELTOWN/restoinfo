import { Schema } from "mongoose";
import mongoose from "../config/mongodb.js";
const PlanReservationSchema = new mongoose.Schema({
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    unique: [true, "Le plan est unique par restaurant"],
    sparse: true,
  },
  horaires: [
    {
      jour: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            const jours =
              "Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche";
            return jours.includes(value);
          },
          message: (props) => `${props.value} n'est pas un jour de semaine`,
        },
      },
      start: String,
      end: String,
    },
  ],
  intervalle_temps: {
    type: String,
    required: true,
  },
  limit_persons: {
    type: Number,
    required: true,
    default: 20,
  },
  specials_days: [
    {
      date: { type: Date, required: true },
      start: String,
      end: String,
      jour_fermer: { type: Boolean, default: false },
    },
  ],
});
const PlanReservation = mongoose.model(
  "PlanReservation",
  PlanReservationSchema
);
PlanReservation.init();
export default PlanReservation;
