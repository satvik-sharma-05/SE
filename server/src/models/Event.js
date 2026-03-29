// models/Event.js - Simplified
import mongoose from "mongoose";
import { EVENT_PLATFORMS, EVENT_TYPES, EVENT_STATUS, PRIZE_TYPES } from "../config/constants.js";

const eventSchema = new mongoose.Schema(
  {
    // Core
    platform: { type: String, required: true, enum: EVENT_PLATFORMS, default: "clist", index: true },
    externalId: { type: String, trim: true, index: true, default: () => new mongoose.Types.ObjectId().toString() },
    type: { type: String, enum: EVENT_TYPES, default: "api" },
    title: { type: String, required: true, trim: true },
    url: String,
    description: { type: String, default: "" },
    start: { type: Date, required: true },
    end: Date,
    location: { type: String, default: "online" },

    // Organizer
    organizerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    // Details
    prize: String,
    prizeType: { type: String, enum: PRIZE_TYPES, default: "unknown" },
    themes: [String],
    skills: [String],
    bannerImage: String,

    // Status
    source: { type: String, enum: ["clist", "devpost", "mlh", "organizer", "manual"], default: "clist" },
    status: {
      type: String,
      enum: EVENT_STATUS,
      default: function () {
        return ["clist", "mlh", "devpost"].includes(this.source) ? "approved" : "pending";
      }
    },
    isApproved: { type: Boolean, default: function () { return this.status === "approved"; } },
  },
  { timestamps: true }
);

// Indexes
eventSchema.index({ platform: 1, externalId: 1 }, { unique: true });
eventSchema.index({ platform: 1, status: 1, start: 1 });
eventSchema.index({ title: "text", description: "text" });

// Pre-save
eventSchema.pre("save", function (next) {
  if (this.source === "organizer") {
    this.platform = "organizer";
    this.type = "manual";
  }
  this.isApproved = this.status === "approved";
  next();
});

export default mongoose.model("Event", eventSchema);
