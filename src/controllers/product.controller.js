import { City } from "../models/city.model.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudinaryimg } from "../utils/cloudinary.js";

/////////////////////  add-products ///////////////////////

const registerproducts = asynchandler(async (req, res) => {
  const {
    cityId,
    cityName,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  } = req.body;

  if (
    (!cityId ||
      !cityName ||
      !tourservice ||
      !duration ||
      !transportService ||
      !pickup ||
      !producttitle ||
      !productdescription ||
      !discountEndDate ||
      !quantity ||
      !discountpercentage ||
      !discountedtotalprice ||
      !category,
    !translatelanguages || !wifi)
  ) {
    throw new apiError(400, "All fields are required products");
  }

  const localimg = req.files?.thumbnailimage.map((file) => file.path);

  if (!localimg) {
    throw new apiError(404, "productsimages is required");
  }

  let uploadedimg = [];
  for (const img of localimg) {
    const uploadimg = await cloudinaryimg(img);
    if (!uploadedimg) {
      throw new apiError(400, "product img is not uploaded");
    }
    uploadedimg.push(uploadimg.url);
  }

  let city;

  if (cityId) {
    city = await City.findById(cityId);
    if (!city) {
      throw new apiError(400, "city not required");
    }
  }

 if (!cityId && cityName) {
  city = await City.findOne({ cityName: cityName.trim() });
  if (!city) {
    throw new apiError(404, `City '${cityName}' not found in backend`);
  }
}

  const user = await Product.create({
    city: city._id,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    thumbnailimage: uploadedimg,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  });

  if (!user) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "product create successfully"));
});

///////////////////////////  update-city /////////////////////////

const updatecity = asynchandler(async (req, res) => {
  const {
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  } = req.body;

  const { id } = req.params;

  // ✅ Extract city info (supports nested "city" object or flat fields)
  const cityId = req.body.city?.cityId || req.body.cityId;
  const cityName = req.body.city?.cityName || req.body.cityName;

  // ✅ Validation: Required fields
  if (
    !tourservice ||
    !duration ||
    !transportService ||
    !pickup ||
    !producttitle ||
    !productdescription ||
    !discountEndDate ||
    !quantity ||
    !discountpercentage ||
    !discountedtotalprice ||
    !category ||
    !translatelanguages ||
    !wifi
  ) {
    throw new apiError(400, "All fields are required for product update");
  }

  // ✅ Find city using ID or Name
  let city;
  if (cityId) {
    city = await City.findById(cityId);
    if (!city) throw new apiError(400, "Invalid cityId");
  } else if (cityName) {
    city = await City.findOne({ cityName: cityName.trim() });
    if (!city) throw new apiError(404, `City '${cityName}' not found`);
  } else {
    throw new apiError(400, "Either cityId or cityName must be provided");
  }

  console.log("🟢 Request Body:", req.body);
  console.log("🏙️ City Found:", city);

  // ✅ Prepare update data safely
  const updatecitydata = {
    ...(city ? { city: city._id } : {}),
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  };

  // ✅ Handle private tour pricing
  if (Isprivate === true || Isprivate === "true") {
    updatecitydata.privateAdultPrice = privateAdultPrice;
    updatecitydata.privateChildPrice = privateChildPrice;
    updatecitydata.privatetransferprice = privatetransferprice;
  } else {
    updatecitydata.privateAdultPrice = null;
    updatecitydata.privateChildPrice = null;
    updatecitydata.privatetransferprice = null;
  }

  // ✅ Update product in database
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updatecitydata },
    { new: true }
  );

  if (!updatedProduct) {
    throw new apiError(404, "Product not found for update");
  }

  // ✅ Send success response
  res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});



////////////////////     update images /////////////////////////////////

const updateimages = asynchandler(async (req, res) => {
  const { id } = req.params;
  const file = req.files?.thumbnailimage;

  if (!file) {
    throw new apiError(400, "update img link is required");
  }

  let uploadedimg = [];

  for (const images of file) {
    const uploadimagesdata = await cloudinaryimg(images.path);
    if (!uploadimagesdata) {
      throw new apiError(404, "upload images data is required");
    }
    uploadedimg.push(uploadimagesdata.url);
  }

  const update = await Product.findByIdAndUpdate(
    id,
    {
      $set: { thumbnailimage: uploadedimg }, // ✅ update correct field
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, update, "update images data successfully"));
});

///////////////////////   get-single-city-data  /////////////

const getsinglecity = asynchandler(async (req, res) => {
  const { cityName } = req.params;

  if (!cityName) {
    throw new apiError(400, "your cityName is not required");
  }

  const singlecity = await City.findOne({ cityName });

  if (!singlecity) {
    throw new apiError(400, "your city name is not required backened");
  }

  const citydata = await Product.find({ city: singlecity._id }).populate(
    "city",
    "cityName cityImage cityDescription"
  );

  if (!citydata) {
    throw new apiError(400, "your city data is not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { city: citydata },
        "Single-city data fetch successfully "
      )
    );
});

///////////////////////////////    get-products      ///////////

const getproducts = asynchandler(async (req, res) => {
  const getcities = await Product.find().populate(
    "city",
    "cityName cityImage cityDescription"
  );

  if (!getcities || !getcities.length === 0) {
    throw new apiError(400, "get cities data is empty");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Product: getcities },
        "get citites data fetch successfully"
      )
    );
});

/////////////////////////   delete-product  ////////////////////////

const deleteproduct = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "your id is not required backened");
  }

  const deletedata = await Product.findByIdAndDelete(id);

  if (!deletedata) {
    throw new apiError(400, "your product isnot delete");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedata, "deleta data successfully"));
});

///////////////////////   get-single-city-id  /////////////
const getsinglecityId = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Product ID is required");
  }

  const product = await Product.findById(id).populate(
    "city",
    "cityName cityImage cityDescription"
  );

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Product: product },
        "Single product data fetched successfully"
      )
    );
});

export {
  registerproducts,
  updatecity,
  updateimages,
  getsinglecity,
  getproducts,
  deleteproduct,
  getsinglecityId,
};
