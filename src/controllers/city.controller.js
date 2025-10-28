import { City } from "../models/city.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudinaryimg } from "../utils/cloudinary.js";

//////////////////////////   add-city  //////////////////////////

const registercity = asynchandler(async (req, res) => {
  const { cityName, cityImage, cityDescription } = req.body;

  if (!cityName || !cityDescription) {
    throw new apiError(400, "All fields are required");
  }

  const existCity = await City.findOne({ cityName });

  if (existCity) {
    throw new apiError(409, "city already exist");
  }

  const localimg = req.files?.cityImage[0].path;
  if (!localimg) {
    throw new apiError(400, "local img is required");
  }

  const upload = await cloudinaryimg(localimg);
  if (!upload) {
    throw new apiError(500, "upload img not sent");
  }

  const createCity = await City.create({
    cityName,
    cityDescription,
    cityImage: upload.url,
    status: "active",
  });

  if (!createCity) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(201, { Cities: createCity }, "create successfully"));
});

///////////////////   update-city //////////////

const updatecity = asynchandler(async (req, res) => {
  const { id } = req.params;

  const { cityName, cityDescription, status } = req.body;

  if (!cityName || !cityDescription || !status) {
    throw new apiError(400, "all filed are required");
  }

  let cityiamgesurl;
  if (req.files.cityImage && req.files.cityImage[0].path) {
    const localimg = req.files?.cityImage[0].path;
    if (!localimg) {
      throw new apiError(400, "update local img is required");
    }
    const uploadimg = await cloudinaryimg(localimg);
    if (!uploadimg) {
      throw new apiError(400, "update cityimg is not uploaded");
    }
    cityiamgesurl = uploadimg.url;
  }

  let updatefiled = {
    cityName,
    cityDescription,
    status,
  };

  if (cityiamgesurl) {
    updatefiled.cityImage = cityiamgesurl;
  }

  const updatedata = await City.findByIdAndUpdate(id, {
    $set: updatefiled,
  });

  if (!updatedata) {
    throw new apiError(500, "server error");
  }

  res.status(200).json(new ApiResponse(200, updatedata, "update successfully"));
});

////////////////////  delete-city /////////////////////

const deletecity = asynchandler(async (req, res) => {
  const { id } = req.params;

  const deletestudent = await City.findByIdAndDelete(id);

  if (!deletestudent) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletestudent, "delete student successfully"));
});




/////////////////// get city //////////////////


const getcity=asynchandler(async (req,res) => {
  
  const cities=await City.find()

  if (!cities) {
    throw new apiError(404,"city data is empty")
  }

  res.status(200).json(
    new ApiResponse(200,cities,"city data fetch successfully")
  )

})









export { registercity, updatecity, deletecity,getcity };
