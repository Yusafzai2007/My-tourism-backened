import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      unique: true,
    },
    cityImage: {
      type: String,
      required: true,
    },
    cityDescription: {
      type: String,
      required: true,
    },
    status:{
      type:String,
        default:"active"
    }
  },
  { timestamps: true }
);

export const City = mongoose.model("City", citySchema);
