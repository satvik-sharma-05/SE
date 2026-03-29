import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, minlength: 6 },

    // OAuth
    githubId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },

    // Role
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PENDING,
    },

    // Profile
    bio: { type: String, default: "" },
    interests: [String],
    preferredRoles: [String],
    skills: [String],
    profileEmbedding: [Number],

    // Location & Education
    location: { type: String, default: "" },
    college: { type: String, default: "" },
    graduationYear: Number,
    domainInterest: [String],

    // Organizer Info
    organization: { type: String, default: "" },
    organizationDescription: { type: String, default: "" },
    website: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },

    // Bookmarks & Gamification
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    // System
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (pwd) {
  return this.password ? bcrypt.compare(pwd, this.password) : false;
};

// Clean output
userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
