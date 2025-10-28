import { Router } from "express";
import {
  deletepayment,
  orderes,
  paymentcreate,
  singleusers,
  updatebookingdata,
} from "../controllers/payment.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
const route = Router();

///////////////////////////////////   payment-route ////////////////////////////

route.post("/payment", jwtVerify, paymentcreate);

///////////////////////////////   get-single-user-payments //////////////////////

route.get("/get-single-payment/:userId", singleusers);

////////////////////////////////          get-all-orders           //////////////////////

route.get("/get-allorders", orderes);

////////////////////////////      update-booking-data     ///////////////////////

route.put("/update-booking/:id", updatebookingdata);

///////////////////////////////////////   delete-payment   //////////////////////

route.delete("/payment-delete/:id", deletepayment);

export default route;
