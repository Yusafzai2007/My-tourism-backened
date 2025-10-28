import { Booking } from "../models/booking.model.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

////////////////////////////////   import-booking ////////////////////////////

const booking = asynchandler(async (req, res) => {
  const { products } = req.body;
  const userId = req.user?._id;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new apiError(400, "Products are required");
  }

  // Build booking data
  const bookingdata = await Promise.all(
    products.map(async (p) => {
      const productdata = await Product.findById(p.product_id).select("city");

      if (!productdata) {
        throw new apiError(400, `Product with ID ${p.product_id} not found`);
      }

      const alreadybooked = await Booking.findOne({
        "cart.product_id": p.product_id,
        "cart.order_date": p.order_date,
      });

      if (alreadybooked) {
        throw new apiError(
          400,
          `Product with ID ${p.product_id} is already booked on ${p.order_date}`
        );
      }

      return {
        product_id: p.product_id,
        city: productdata.city,
        order_date: p.order_date,
        adult_no: p.adult_no,
        child_no: p.child_no,
        transport_type: p.transport_type,
        private_adult_no: p.private_adult_no || 0,
        private_child_no: p.private_child_no || 0,
        private_transport_type: p.private_transport_type || null,
        total: p.total,
      };
    })
  );

  // Find or create booking record
  let userBooking = await Booking.findOne({ user_id: userId });

  if (userBooking) {
    userBooking.cart.push(...bookingdata);
    await userBooking.save();
  } else {
    userBooking = await Booking.create({
      user_id: userId,
      cart: bookingdata,
    });
  }

  // ✅ Return the correct booking object
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookings: userBooking },
        "Products booked successfully"
      )
    );
});

//////////////////////////  get-single-booking //////////////////////

const singleuser = asynchandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await Booking.find({ user_id: userId })
    .populate("cart.product_id")
    .populate("cart.city")
    .populate("user_id");

  if (!user || !user.length === 0) {
    throw new apiError(400, "booking data is empty");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { user: user }, "booking data fecth "));
});

////////////////////////  delete-booking-data   ///////////////////

const deletebooking = asynchandler(async (req, res) => {
  const { bookingId, cartItemId } = req.params; // dono id params se aayengi

  // check booking exist karta hai?
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new apiError(404, "Booking not found");
  }

  // cart ke andar se filter karke item remove karo
  booking.cart = booking.cart.filter(
    (item) => item._id.toString() !== cartItemId
  );

  // updated document save karo
  await booking.save();

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Cart item deleted successfully"));
});

export { booking, singleuser, deletebooking };
