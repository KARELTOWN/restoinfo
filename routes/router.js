import express from "express";
const router = express.Router();
import AuthRouter from "./Auth/AuthRouter.js";
import UserRouter from "./User/UserRoute.js";
import isauthentificate from "../middleware/isAuthentificate.js";
import RestaurantRouter from "./Restaurant/RestaurantRouter.js";
import ReservationRouter from "./Reservation/ReservationRouter.js";

router.use("/user", isauthentificate, UserRouter);
router.use("/", AuthRouter);
router.use("/restaurant", isauthentificate, RestaurantRouter);
router.use("/reservation", isauthentificate, ReservationRouter);
export default router;
