import { connecteddb } from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

await connecteddb(); // connect to MongoDB

// ❌ Remove app.listen()
// ✅ Instead, export the app for Vercel to handle
export default app;
