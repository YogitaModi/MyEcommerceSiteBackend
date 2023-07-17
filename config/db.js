const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to mongodb database successfully`);
  } catch (error) {
    console.log(`internal server error`);
  }
};
module.exports = connectDb;
