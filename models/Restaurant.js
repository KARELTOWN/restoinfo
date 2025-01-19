import { Schema, SchemaTypes, Types } from "mongoose";
import mongoose from "../config/mongodb.js";
import validatorJS from "validator";
const RestaurantSchema = new mongoose.Schema(
  {
    denomination: {
      type: String,
      required: true,
    },
    gerant: {
      type: String,
      required: true,
    },
    proprietaire: {
      type: String,
      required: true,
    },
    type_cuisines: [
      {
        type: SchemaTypes.ObjectId,
        ref: "TypeCuisine",
        required: true,
      },
    ],
    type_repas: [
      {
        type: SchemaTypes.ObjectId,
        ref: "TypeRepas",
        required: true,
      },
    ],
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
    regimes: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Regime",
        required: true,
      },
    ],
    fonctionnalites: [
      {
        type: SchemaTypes.ObjectId,
        ref: "FonctionnaliteResto",
        required: true,
      },
    ],
    fichiers: [
      {
        type: SchemaTypes.ObjectId,
        ref: "FileRestaurant",
        required: true,
      },
    ],
    website: {
      validate: {
        validator: function (value) {
          if (value) {
            return validatorJS.isURL(value);
          }
        },
        message: (props) => `${props.value} n'est pas une url valide`,
      },
      type: String,
    },

    aboutus: {
      type: String,
      validate: {
        validator: function (value) {
          const taille = value.length;
          return taille <= 1000;
        },
        message: (props) =>
          "A propos de moi ne doit pas dépasser 1000 caractères",
      },
    },
    code: {
      type: String,
      required: true,
      default: "+33",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Cet email est déjà utilisé"],
      sparse: true,
    },

    country: {
      type: String,
    },
    ville: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    maps: {
      type: String,
    },
    active_profil: {
      type: Boolean,
      required: true,
      default: false,
    },
    accept: {
      type: Boolean,
      required: true,
      default: false,
    },
    pending_update: Boolean,
    toUpdate: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;
