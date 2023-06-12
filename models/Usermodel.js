const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: "String",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
