import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signup",
      required: true,
    },
    cart: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        city: {
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
        total:{
          type:String,
          required:true
        }
      },
    ],
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
