import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiError } from "./utils/apiError.js"; // 👈 import your custom error class
import cityRoute from "./routes/city.route.js";
import productRoute from "./routes/product.route.js"
import singuproute from "./routes/signup.route.js"
import bookingRoute from "./routes/booking.route.js"
import paymentRoute from "./routes/payment.route.js"
const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: process.env.Cors_ORIGN || "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// ✅ import city Routes
app.use("/api/v1/tourism", cityRoute);


//////////////////////////////      import product route ////////////

app.use("/api/v1/tourism",productRoute)



///////////     import-signup-route ///////////


app.use("/api/v1/tourism",singuproute)


/////////////////////  import-booking-route   /////////////////////



app.use("/api/v1/tourism",bookingRoute)












//////////////// payment-route-js  ///////////////////////

app.use("/api/v1/tourism",paymentRoute)





// ✅ Custom Error Handling Middleware (must be at the END)
app.use((err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      error: err.error || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
