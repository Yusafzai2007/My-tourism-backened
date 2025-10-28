import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signup",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    order_date: {
      type: String,
      required: true,
    },
    adult_no: {
      type: Number,
      default: 0,
    },
    child_no: {
      type: Number,
      default: 0,
    },
    transport_type: {
      type: String,
    },
    total: {
      type: Number,
      default: 0,
    },
    private_adult_no: {
      type: Number,
      default: 0,
    },

    private_child_no: {
      type: Number,
      default: 0,
    },
    private_transport_type: {
      type: String,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String, required: true },
    payment_Method: { type: String, required: true },
    city: { type: String },
    state: { type: String, required: true },
    country: { type: String, required: true },
    name_On_Card: { type: String, required: true },
    card_Number: { type: String, required: true },
    zip: { type: Number, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
