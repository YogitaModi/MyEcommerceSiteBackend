const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

dotenv.config();

// connecting to mongodb
connectDb();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("welcome to my app");
});
app.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
