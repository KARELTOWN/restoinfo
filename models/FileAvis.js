import mongoose from "../config/mongodb.js";

const FileAvisSchema = new mongoose.Schema(
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

const FileAvis = mongoose.model("FileAvis", FileAvisSchema);
export default FileAvis;
