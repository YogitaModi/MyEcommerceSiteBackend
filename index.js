const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const auth = require("./routes/auth");
const category = require("./routes/category");
const product = require("./routes/product");
const morgan = require("morgan");

dotenv.config();

// connecting to mongodb
connectDb();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// createing routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/category", category);
app.use("/api/v1/product", product);

app.get("/", (req, res) => {
  res.send("welcome to my app");
});

app.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
