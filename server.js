import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes.js";
import Url from "./models/Url.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* ---------- DATABASE ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* ---------- ROOT ROUTE (CRITICAL FOR RENDER) ---------- */
app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

/* ---------- API ROUTES ---------- */
app.use("/api", urlRoutes);

/* ---------- REDIRECT ROUTE (MUST BE LAST) ---------- */
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) return res.status(404).send("Link not found");
    if (url.expiresAt < new Date())
      return res.status(410).send("Link expired");

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
