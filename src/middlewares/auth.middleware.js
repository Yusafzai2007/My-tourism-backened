import { signup } from "../models/signup.model.js";
import { apiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const jwtVerify = asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.isaccesstoken || // ✅ yahan sahi
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(400, "unauthorized req");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await signup.findById(decode._id).select("-password");

    if (!user) {
      throw new apiError(400, "unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "invalid token");
  }
});

export { jwtVerify };
