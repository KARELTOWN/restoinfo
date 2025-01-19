import express from "express";
import RestaurantController from "../../controllers/Restaurant/RestaurantController.js";
const RestaurantRouter = express.Router();
import { uploadFileRestaurant, deleteRestaurantFile } from "../../services/awsS3.js";
import {
  validateCreateRestaurant,
  validateRestaurantAddFiles,
  validateUpdateRestaurant,
  validateAdminCreateRestaurant,
  validateUpdateRestaurantFonctionnalite,
  validateUpdateRestaurantRegime,
  validateUpdateRestaurantRepas,
  validateUpdateRestaurantCuisine,
  validateUpdateRestaurantHoraire,
  validateAcceptRestaurant,
  validateUpdateRestaurantStatus,
} from "../../validator/restaurant/restaurantvalidator.js";
const {
  uploadRestaurantFiles,
  addFilesTorestaurant,
  updateRestaurant,
  createRestaurant,
  // updateRestaurantFonctionnalite,
  // updateRestaurantRegime,
  // updateRestaurantCuisine,
  updateRestaurantStatus,
  // updateRestaurantHoraires,
  // updateRestaurantRepas,
  acceptRestaurant,
  acceptUpdateRestaurant,
  index,
  show,
} = RestaurantController();

RestaurantRouter.get("/get", index);

RestaurantRouter.get("/show/:restaurant", show);

RestaurantRouter.post("/add", validateCreateRestaurant, createRestaurant);
RestaurantRouter.post(
  "/admin/add",
  validateAdminCreateRestaurant,
  createRestaurant
);

RestaurantRouter.put("/accept/:restaurant", validateAcceptRestaurant, acceptRestaurant);

RestaurantRouter.patch(
  "/update-status/:restaurant",
  validateUpdateRestaurantStatus,
  updateRestaurantStatus
);

RestaurantRouter.put(
  "/accept-update/:restaurant",
  validateAcceptRestaurant,
  acceptUpdateRestaurant
);

RestaurantRouter.put(
  "/update/:restaurant",
  validateUpdateRestaurant,
  updateRestaurant
);

RestaurantRouter.patch(
  "/update-fonctionnalites/:restaurant",
  validateUpdateRestaurantFonctionnalite,
  updateRestaurant
);
RestaurantRouter.patch(
  "/update-regimes/:restaurant",
  validateUpdateRestaurantRegime,
  updateRestaurant
);

RestaurantRouter.patch(
  "/update-cuisines/:restaurant",
  validateUpdateRestaurantCuisine,
  updateRestaurant
);

RestaurantRouter.patch(
  "/update-repas/:restaurant",
  validateUpdateRestaurantRepas,
  updateRestaurant
);

RestaurantRouter.patch(
  "/update-horaires/:restaurant",
  validateUpdateRestaurantHoraire,
  updateRestaurant
);

RestaurantRouter.post(
  "/upload-files",
  uploadFileRestaurant.array("files"),
  uploadRestaurantFiles
);

RestaurantRouter.put(
  "/add-files/:restaurant",
  uploadFileRestaurant.array("files"),
  validateRestaurantAddFiles,
  addFilesTorestaurant
);

RestaurantRouter.delete(
  "/delete-file/:restaurant",
  deleteRestaurantFile
);

export default RestaurantRouter;
