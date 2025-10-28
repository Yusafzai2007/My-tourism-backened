import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connecteddb = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(connect.connection.host);
    return connect;
  } catch (error) {
    console.log(`Mongodb connection errro${error}`);
  }
};

export { connecteddb };