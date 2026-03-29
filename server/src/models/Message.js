// models/Message.js - Simplified
import mongoose from "mongoose";
import { MESSAGE_TYPES } from "../config/constants.js";

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  messageType: { type: String, enum: MESSAGE_TYPES, default: "text" },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

messageSchema.index({ chat: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);    