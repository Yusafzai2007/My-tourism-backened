import { connecteddb } from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

connecteddb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(`Error in db connection ${err}`);
  });
