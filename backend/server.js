const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const caseRoutes = require("./routes/caseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/cases", caseRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/ecourt")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000, () => console.log("Server running"));