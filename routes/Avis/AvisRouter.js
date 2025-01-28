import express from "express";
import { uploadFileAvis } from "../../services/awsS3.js";
import AvisController from "../../controllers/Avis/AvisController.js";
import {
  validateAddAvis,
  validateEditStatut,
} from "../../validator/avis/avis.js";
const AvisRouter = express.Router();
const { storeAvis, storeFileAvis, changeStatutAvis } = AvisController();
AvisRouter.post("/upload-files", uploadFileAvis.array("files"), storeFileAvis);
AvisRouter.put("/add/:restaurant", validateAddAvis, storeAvis);
AvisRouter.put(
  "/editstatut/:avis",
  validateEditStatut,
  changeStatutAvis
);
export default AvisRouter;
