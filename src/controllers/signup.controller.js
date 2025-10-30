import { signup } from "../models/signup.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const generateaccesstoken = async (userId) => {
  try {
    const user = await signup.findById(userId);
    const isaccesstoken = await user.isaccesstoken();
    const isrefrehtoken = await user.isrefrehtoken();
    return { isaccesstoken, isrefrehtoken };
  } catch (error) {
    throw new apiError(500, "token generating problem");
  }
};

//////////////////////////////  signup-data ///////////////////////////

const signupdata = asynchandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new apiError(400, "all filed are required");
  }

  const existemail = await signup.findOne({ email });

  if (existemail) {
    throw new apiError(409, "email already exist");
  }

  const user = await signup.create({
    userName,
    email,
    password,
    role: "user",
  });

  if (!user) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "singup create successfully"));
});

/////////////////////////////  login-data //////////////////////////////

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(400, "all filed are required");
  }

  const existlogin = await signup.findOne({ email });

  if (!existlogin) {
    throw new apiError(404, "user does not exist");
  }

  const checkpassword = await existlogin.ispasswordcorrect(password);

  if (!checkpassword) {
    throw new apiError(404, "your password wrong");
  }

  const { isaccesstoken, isrefrehtoken } = await generateaccesstoken(
    existlogin._id
  );
  // console.log("isaccesstoken", isaccesstoken);
  // console.log("isrefrehtoken", isrefrehtoken);

  const loginuser = await signup.findById(existlogin._id).select("-password");

  const option = {
    httpOnly: true,
    secure: false,
  };

  res
    .status(200)
    .cookie("isaccesstoken", isaccesstoken, option)
    .cookie("isrefrehtoken", isrefrehtoken, option)
    .json(new ApiResponse(200, loginuser, "user login successfully"));
});

////////////////////////  logout-user //////////////////////////

const logoutUser = asynchandler(async (req, res) => {
  await signup.findByIdAndUpdate(req.user._id);

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("isaccesstoken", option)
    .clearCookie("isrefrehtoken", option)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

////////////////////////  get-users   //////////////////////

const getusers = asynchandler(async (req, res) => {
  const user = await signup.find().select("-password");

  if (!user || !user.length === 0) {
    throw new apiError(400, "user data is emoty");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { users: user }, "user data fetch successfully")
    );
});

const deletUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "bad request");
  }
  const dletedata = await signup.findByIdAndDelete(id);

  if (!dletedata) {
    throw new apiError(500, "server error");
  }

  res.status(200).json(new ApiResponse(200, "deleted succesfully"));
});

const add_Admin = asynchandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new apiError(404, "All filed are required");
  }

  const existemail = await signup.findOne({ email });

  if (existemail) {
    throw new apiError(409, "This Admin email already exist");
  }

  const admin = await signup.create({
    userName,
    email,
    password,
    role: "admin",
  });

  if (!admin) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, admin, "admin create successfully"));
});

const currentuser = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apiError(404, "user nto found");
  }

  res.status(200).json(new ApiResponse(200, { users: user }, "succesfully"));
});

export {
  signupdata,
  loginUser,
  logoutUser,
  getusers,
  deletUser,
  add_Admin,
  currentuser,
};
