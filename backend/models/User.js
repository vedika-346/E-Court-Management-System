const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "judge", "lawyer", "citizen"],
    default: "citizen",
  },
});

module.exports = mongoose.model("User", userSchema);