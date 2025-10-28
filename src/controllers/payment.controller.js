import { Booking } from "../models/booking.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Payment } from "../models/payment.model.js";

/////////////////////////////   import-payment ////////////////////////////

const paymentcreate = asynchandler(async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    payment_Method,
    state,
    country,
    name_On_Card,
    card_Number,
    zip,
    expiry,
    cvv,
    city,
  } = req.body;

  const user_id = req.user?._id;

  const bookings = await Booking.find({ user_id })
    .populate("cart.product_id")
    .populate("cart.city");

  if (!bookings || bookings.length === 0) {
    throw new apiError(400, "No booking found for this user");
  }

  const paymentdata = await Promise.all(
    bookings.map(async (book) => {
      return await Promise.all(
        book.cart.map(async (item) => {
          // ✅ Create payment entry with booking details
          return await Payment.create({
            order: book._id,
            userId: user_id,
            productId: item.product_id?._id,
            cityId: item.city?._id,
            order_date: item.order_date,
            adult_no: item.adult_no,
            total: item.total,
            child_no: item.child_no,
            transport_type: item.transport_type,
            private_adult_no: item.private_adult_no,
            private_child_no: item.private_child_no,
            private_transport_type: item.private_transport_type,
            first_name,
            last_name,
            address,
            payment_Method,
            city,
            state,
            country,
            name_On_Card,
            card_Number,
            zip,
            expiry,
            cvv,
          });
        })
      );
    })
  );

  await Booking.deleteMany({ user_id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { paymentdata: paymentdata.flat() },
        "Payment recorded successfully for all booked products"
      )
    );
});

//////////////////////////  get-single-user-payments //////////////////////
const singleusers = asynchandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "userId is required");
  }

  // ✅ Find all payments for this user
  const userPayments = await Payment.find({ userId })
    .populate({ path: "userId", select: "-password" }) // User details
    .populate({ path: "productId", select: "-city" }) // Product details
    .populate("cityId"); // City details

  if (!userPayments || userPayments.length === 0) {
    throw new apiError(404, "No payment record found for this user");
  }

  // ✅ Send successful response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders: userPayments },
        "Single user data fetched successfully"
      )
    );
});

//////////////////////////////          get-all-orders           //////////////////////

const orderes = asynchandler(async (req, res) => {
  const users = await Payment.find()
    .populate({ path: "userId", select: "-password" }) // Get user details
    .populate({ path: "productId", select: "-city" }) // Get product details
    .populate("cityId"); // Get city details

  if (!users || users.length === 0) {
    throw new apiError(400, "Your API is empty — no payment records found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { orders: users }, "Orders fetched successfully")
    );
});

/////////////////////////////      update-booking-data     ///////////////////////

const updatebookingdata = asynchandler(async (req, res) => {
  const { id } = req.params;
  const {
    order_date,
    adult_no,
    child_no,
    transport_type,
    total,
    private_adult_no,
    private_child_no,
    private_transport_type,
  } = req.body;

  const user = await Payment.findByIdAndUpdate(id, {
    $set: {
      order_date,
      adult_no,
      child_no,
      transport_type,
      total,
      private_adult_no,
      private_child_no,
      private_transport_type,
    },
  });

  if (!user) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "userdata fetch successfully"));
});

///////////////////////////   delete-payment-data ///////////////////////

const deletepayment = asynchandler(async (req, res) => {
  const { id } = req.params;

  const deletedata = await Payment.findByIdAndDelete({_id:id});

  if (!deletedata) {
    throw new apiError(404, "Payment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedata, "payment data delete successfully"));
});

export {
  paymentcreate,
  singleusers,
  orderes,
  updatebookingdata,
  deletepayment,
};
