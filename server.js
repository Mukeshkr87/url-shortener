import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes.js";
import Url from "./models/Url.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// API routes
app.use("/api", urlRoutes);

// ✅ REDIRECT ROUTE (FIXED)
app.get("/r/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (!url) return res.status(404).send("Link not found");
  if (url.expiresAt < new Date())
    return res.status(410).send("Link expired");

  res.redirect(url.originalUrl);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
