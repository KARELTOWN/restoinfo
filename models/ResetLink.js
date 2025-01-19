import { Schema } from "mongoose";
import mongoose from "../config/mongodb.js";
import moment from "moment";
import { randomUUID } from "crypto";

const ResetLinkSchema = new mongoose.Schema(
  {
    code: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      required: true,
      unique: [true, "Le code de réinitialisation est unique"],
    },
    expiration: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    device: {
      typ: {
        type: String,
        required: true,
      },
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      ip: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    methods: {},
  }
);

ResetLinkSchema.pre("save", function (next) {
  if (this.expiration) {
    // Durée d'expiration 3 heures
    this.expiration = moment(this.expiration).add(3, "hours");
  }
  next();
});

ResetLinkSchema.methods.isExpired = async function () {
  // const resetlink = await mongoose
  //   .model(ResetLink)
  //   .findOne({ code: data })
  //   .exec();
  const now = moment();
  const expirationDate = moment(this.expiration);
  if (expirationDate.isSameOrAfter(now)) {
    return false;
  } else {
    return true;
  }
};

const ResetLink = mongoose.model("ResetLink", ResetLinkSchema);
export default ResetLink;
