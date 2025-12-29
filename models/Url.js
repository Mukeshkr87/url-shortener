import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-delete expired links
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Url", urlSchema);
