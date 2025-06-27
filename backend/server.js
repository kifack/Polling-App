require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
const PORT = process.env.PORT || 5000;
connectDB();

// Server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/poll", pollRoutes);
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
