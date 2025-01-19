import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
const Avisschema = new mongoose.Schema(
  {
    restaurant: {
      type: SchemaTypes.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    rating: {
      type: Number,
      validate: {
        validator: function (value) {
          ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"].includes(value);
        },
        message: (props) => `${props.value} n'est pas une note valide`,
      },
    },
    contenu: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length <= 300;
        },
        message: (props) => `${props.value} n'est pas une note valide`,
      },
    },
    fichiers: [
      {
        type: SchemaTypes.ObjectId,
        ref: "FileAvis",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Avis = mongoose.model("Avis", Avisschema);
export default Avis;
