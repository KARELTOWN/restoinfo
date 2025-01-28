import express from "express";
const router = express.Router();
import AuthRouter from "./Auth/AuthRouter.js";
import UserRouter from "./User/UserRoute.js";
import isauthentificate from "../middleware/isAuthentificate.js";
import RestaurantRouter from "./Restaurant/RestaurantRouter.js";
import ReservationRouter from "./Reservation/ReservationRouter.js";
import smsController from "../config/sms.js";
import AvisRouter from "./Avis/AvisRouter.js";
const { sendSMS } = smsController();
router.use("/user", isauthentificate, UserRouter);
router.use("/", AuthRouter);
router.use("/restaurant", isauthentificate, RestaurantRouter);
router.use("/reservation", isauthentificate, ReservationRouter);
router.use("/avis", isauthentificate, AvisRouter);
export default router;

router.get("/sendsms", (req, res) => {
  sendSMS("0199997478", "Hello");
});
