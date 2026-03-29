// models/Chat.js - Simplified
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  invitation: { type: mongoose.Schema.Types.ObjectId, ref: "TeamInvitation" },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

chatSchema.index({ participants: 1 });

// Prevent duplicate chats
chatSchema.pre("save", async function (next) {
  if (!this.isNew || this.participants.length !== 2) return next();

  const [u1, u2] = this.participants.sort();
  const exists = await this.constructor.findOne({
    participants: { $all: [u1, u2], $size: 2 }
  });

  if (exists) {
    const err = new Error("Chat exists");
    err.code = 11000;
    return next(err);
  }
  next();
});

export default mongoose.model("Chat", chatSchema);