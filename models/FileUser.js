import mongoose from "../config/mongodb.js";

const FileUserSchema = new mongoose.Schema(
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
    },
  },
  {
    timestamps: true,
  }
);

const FileUser = mongoose.model("FileUser", FileUserSchema);
export default FileUser;
