import express from "express";
import UserController from "../../controllers/User/UserController.js";
const UserRouter = express.Router();
import { uploadFileUser } from "../../services/awsS3.js";
import {
  validateProfil,
  validateUpdatePassword,
  validateAdminAddUser,
  validateAdminUpdateUser,
  validateAdminUpdateStatus,
  validateAdminGeneratePassword,
} from "../../validator/user/uservalidator.js";
const {
  changePhoto,
  updateProfil,
  updatePassword,
  adminAddUser,
  adminUpdateUser,
  adminUpdateStatus,
  adminGeneratePassword,
  showUser,
  getUsers,
} = UserController();
UserRouter.get("/show-user/:user", showUser);
UserRouter.get("/get-users", getUsers);
UserRouter.post("/update-photo", uploadFileUser.single("photo"), changePhoto);
UserRouter.put("/update-profil/:user", validateProfil, updateProfil);
UserRouter.patch("/update-password/:user", validateUpdatePassword, updatePassword);

//ADMINISTRATEUR
UserRouter.post("/admin/add-user", validateAdminAddUser, adminAddUser);
UserRouter.put("/admin/update-user/:user", validateAdminUpdateUser, adminUpdateUser);
UserRouter.get(
  "/admin/generate-password/:user",
  validateAdminGeneratePassword,
  adminGeneratePassword
);
UserRouter.patch(
  "/admin/update-status/:user",
  validateAdminUpdateStatus,
  adminUpdateStatus
);
export default UserRouter;
