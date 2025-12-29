import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes.js";
import Url from "./models/Url.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true,        // allow any origin
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api", urlRoutes);

// Redirect handler
app.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (!url) return res.status(404).send("Link not found");
  if (url.expiresAt < new Date())
    return res.status(410).send("Link expired");

  res.redirect(url.originalUrl);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
