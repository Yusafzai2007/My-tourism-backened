import { Router } from "express";
import {
  getsinglecity,
  registerproducts,
  updatecity,
  updateimages,
  getproducts,
  deleteproduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const route = Router();

/////////////////////////  add-products  /////////////////////////

route.post(
  "/product",
  upload.fields([
    {
      name: "thumbnailimage",
      maxCount: 3,
    },
  ]),
  registerproducts
);

//////////////////////////  update-products  /////////////////////////

route.put("/update-product/:id", updatecity);

/////////////////////     update-images-product ///////////////////////

route.put(
  "/update-images/:id",
  upload.fields([
    {
      name: "thumbnailimage",
      maxCount: 3,
    },
  ]),
  updateimages
);

//////////////////////// get-single-citydata ///////////////////////

route.get("/single-citydata/:cityName", getsinglecity);

///////////////////  get-products //////////////////////

route.get("/get-products", getproducts);

/////////////////////////////////  delete-products   //////////////////////

route.delete("/delete-products/:id", deleteproduct);

export default route;
