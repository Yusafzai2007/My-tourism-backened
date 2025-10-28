import { Router } from "express";
import {
  registercity,
  updatecity,
  deletecity,
  getcity,
} from "../controllers/city.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const route = Router();

//////////////////////// add-city-routes //////////////////////

route.post(
  "/city",
  upload.fields([
    {
      name: "cityImage",
      maxCount: 1,
    },
  ]),
  registercity
);

//////////////////  update-city-routes /////////////

route.put(
  "/update-city/:id",
  upload.fields([
    {
      name: "cityImage",
      maxCount: 1,
    },
  ]),
  updatecity
);

////////////////////////      delete-city-route ///////////////////

route.delete("/delete-city/:id", deletecity);

////////////////  get-city-routes /////////////////////

route.get("/get-city", getcity);

export default route;
