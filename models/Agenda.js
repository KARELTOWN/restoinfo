import { Schema, SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import PlanReservation from "./PlanReservation.js";
const AgendaSchema = new mongoose.Schema(
  {
    restaurant: {
      type: SchemaTypes.ObjectId,
      ref: "Restaurant",
    },
    date: {
      type: Date,
      required: true,
    },
    jour_fermer: { type: Boolean, default: false },
    heure: {
      type: String,
    },
    raison: {
      type: String,
    },
    persons: {
      type: Number,
    },
    // reservation_speciale: {
    //   heure_debut: {
    //     type: String,
    //     required: true,
    //   },
    //   heure_fin: {
    //     type: String,
    //     required: true,
    //   },
    // },
    accept_reservation: {
      type: Boolean,
      required: true,
      default: false,
    },
    pending: {
      type: Boolean,
      default: true,
    },
    reserved_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    validated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Agenda = mongoose.model("Agenda", AgendaSchema);
export default Agenda;
