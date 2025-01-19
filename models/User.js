import { SchemaTypes } from "mongoose";
import mongoose from "../config/mongodb.js";
import FileUser from "./FileUser.js";
import Role from "./Role.js";
import FonctionUser from "./Fonction.js";
import validatorJS from "validator";
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
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
      sparse: true, //Rend l'index unique applicable uniquement aux documents qui ont une valeur pour ce champ.
    },
    country: {
      type: String,
    },
    ville: {
      type: String,
    },
    adress: {
      type: String,
    },
    role: {
      type: SchemaTypes.ObjectId,
      ref: Role,
      required: true,
    },
    fonction: {
      type: SchemaTypes.ObjectId,
      ref: FonctionUser,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    photo: {
      type: SchemaTypes.ObjectId,
      ref: FileUser,
    },
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
    aboutme: {
      type: String,
      validate: {
        validator: function (value) {
          if(value)
          {
            const taille = value.length;
            return taille <= 200;
          }
       
        },
        message: (props) =>
          "A propos de moi ne peut pas dépasser 200 caractères",
      },
    },
    username: {
      type: String,
      required: true,
      minlength: [5, "Minimum 5 caractères"],
      maxlength: [15, "Maximum 15 caractères"],
      unique: true,
      sparse: true
    },
    active_account: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.photo_data = async function () {
  const photo = await this.populate("photo");
  return photo;
};

UserSchema.index({ code: 1, phone: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
export default User;
