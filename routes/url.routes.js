import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  const { originalUrl, days } = req.body;

  if (!originalUrl || !days) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (days < 1 || days > 30) {
    return res.status(400).json({ message: "Days must be 1–30" });
  }

  const expiresAt = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  );

  const shortCode = nanoid(6);

  await Url.create({
    originalUrl,
    shortCode,
    expiresAt,
  });

  res.json({
    shortUrl: `${process.env.BASE_URL}/r/${shortCode}`,
    expiresAt,
  });
});

export default router;
