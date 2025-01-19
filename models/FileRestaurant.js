import mongoose from "../config/mongodb.js";

const FileRestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const FileRestaurant = mongoose.model("FileRestaurant", FileRestaurantSchema);
export default FileRestaurant;
