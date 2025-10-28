import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    tourservice: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    transportService: {
      type: String,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    producttitle: {
      type: String,
      required: true,
    },
    productdescription: {
      type: String,
      required: true,
    },
    discountEndDate: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    discountpercentage: {
      type: String,
      required: true,
    },
    Isprivate: {
      type: Boolean,
      default: false,
    },
    privateAdultPrice: {
      type: Number,
      default: null,
    },
    privateChildPrice: {
      type: Number,
      default: null,
    },
    privatetransferprice: {
      type: Number,
      default: null,
    },
    discountedtotalprice: {
      type: Number,
      required: true,
    },
    thumbnailimage: {
      type: [String],
      required: true,
    },
    adultbaseprice: {
      type: Number,
      default: null,
    },
    childbaseprice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
    },
    translatelanguages: {
      type: String,
      required: true,
    },
    wifi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
