import { Router } from "express";
import {
  deletUser,
  getusers,
  loginUser,
  logoutUser,
  signupdata,
} from "../controllers/signup.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const route = Router();

route.post("/signup", signupdata);

route.post("/login", loginUser);
route.delete("/deletUser/:id", deletUser);

route.post("/logout", jwtVerify, logoutUser);

route.get("/user", getusers);

export default route;
 