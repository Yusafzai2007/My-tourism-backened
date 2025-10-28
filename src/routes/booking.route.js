import { Router } from "express";
import {
  booking,
  deletebooking,
  singleuser,
} from "../controllers/booking.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const route = Router();

route.post("/booking", jwtVerify, booking);

route.get("/single-user-booking", jwtVerify, singleuser);

route.delete("/booking/:bookingId/cart/:cartItemId", deletebooking);
export default route;
