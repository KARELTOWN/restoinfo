import express from "express";
import authController from "../../controllers/auth/auth.js";
const AuthRouter = express.Router();

import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
} from "../../validator/auth/authValidator.js";
const {
  login,
  register,
  forgotPassword,
  refreshToken,
  desapprove,
  resetPassword,
} = authController();
AuthRouter.post("/login", validateLogin, login);
AuthRouter.post("/register", validateRegister, register);
AuthRouter.post("/refresh-token", refreshToken);
AuthRouter.get(
  "/forgot-password/:email",
  validateForgotPassword,
  forgotPassword
);
AuthRouter.post(
  "/desapprouve-reinitialisation/:email",
  validateForgotPassword,
  desapprove
);
AuthRouter.patch(
  "/reset-password/:email",
  validateResetPassword,
  resetPassword
);
export default AuthRouter;
