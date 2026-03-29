// server/src/routes/organizer.js
import express from "express";
import auth from "../middleware/auth.js";
import { requireOrganizer } from "../middleware/roles.js";
import { createEventLimiter } from "../middleware/rateLimiter.js";
import { sanitizeInput, validateRequired } from "../middleware/validation.js";
import User from "../models/User.js";
import Event from "../models/Event.js";

const router = express.Router();

/* -------------------------
   👤 GET ORGANIZER PROFILE
-------------------------- */
router.get("/profile", auth, requireOrganizer, async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("name email avatar organization organizationDescription bio website contactEmail contactNumber location linkedin twitter")
      .lean();

    if (!user) return res.status(404).json({ message: "Organizer not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Organizer profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* -------------------------
   ✏️ UPDATE ORGANIZER PROFILE
-------------------------- */
router.put("/profile",
  auth,
  requireOrganizer,
  sanitizeInput(['name', 'bio', 'organization', 'organizationDescription']),
  async (req, res) => {
    try {

      const allowedFields = [
        "name", "avatar", "organization", "organizationDescription", "bio",
        "website", "contactEmail", "contactNumber", "location", "linkedin", "twitter"
      ];

      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      }

      const updated = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({ success: true, user: updated });
    } catch (err) {
      console.error("Organizer profile update error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

/* -------------------------
   📦 FETCH ALL ORGANIZER EVENTS
-------------------------- */
router.get("/my-events", auth, requireOrganizer, async (req, res) => {
  try {

    const events = await Event.find({
      createdBy: req.user._id,
      platform: "organizer",
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, events });
  } catch (err) {
    console.error("Organizer my-events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------
   📊 ORGANIZER DASHBOARD SUMMARY
-------------------------- */
router.get("/summary", auth, requireOrganizer, async (req, res) => {
  try {

    const total = await Event.countDocuments({
      createdBy: req.user._id,
      platform: "organizer",
    });

    const active = await Event.countDocuments({
      createdBy: req.user._id,
      platform: "organizer",
      end: { $gte: new Date() },
    });

    const past = await Event.countDocuments({
      createdBy: req.user._id,
      platform: "organizer",
      end: { $lt: new Date() },
    });

    res.json({ success: true, stats: { total, active, past } });
  } catch (err) {
    console.error("Organizer summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------
   ✅ CREATE ORGANIZER EVENT
-------------------------- */
router.post("/create",
  auth,
  requireOrganizer,
  createEventLimiter,
  validateRequired(['title', 'start', 'end']),
  sanitizeInput(['title', 'description']),
  async (req, res) => {
    try {

      const {
        title, description, start, end, location, prize, prizeType,
        themes, skills, url, bannerImage
      } = req.body;

      if (!title || !start || !end)
        return res.status(400).json({ message: "Title, start, and end are required" });

      const event = await Event.create({
        title,
        description,
        start,
        end,
        location,
        prize,
        prizeType,
        themes,
        skills,
        url,
        bannerImage,
        organizerRef: req.user._id,
        createdBy: req.user._id,
        source: "organizer",
        platform: "organizer",
        type: "manual",
        status: "approved",
        isApproved: true,
      });

      res.status(201).json({ success: true, message: "Event created successfully", event });
    } catch (err) {
      console.error("Create event error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

/* -------------------------
   ✏️ UPDATE ORGANIZER EVENT
-------------------------- */
router.put("/:id",
  auth,
  requireOrganizer,
  sanitizeInput(['title', 'description']),
  async (req, res) => {
    try {

      const event = await Event.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
        platform: "organizer",
      });

      if (!event)
        return res.status(404).json({ message: "Event not found or unauthorized" });

      const allowedFields = [
        "title", "description", "start", "end", "location", "prize",
        "prizeType", "themes", "skills", "url", "bannerImage"
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) event[field] = req.body[field];
      });

      await event.save();

      res.json({ success: true, message: "Event updated successfully", event });
    } catch (err) {
      console.error("Update event error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

/* -------------------------
   🔍 GET SINGLE EVENT FOR EDITING
-------------------------- */
router.get("/event/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      platform: "organizer",
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ success: true, event });
  } catch (err) {
    console.error("Fetch event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------
   🗑️ DELETE EVENT
-------------------------- */
// routes/organizer.js
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("Deleting event:", req.params.id, "by user:", req.user._id);

    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,   // ← CORRECT: req.user._id (Mongoose doc)
    });

    if (!deleted) {
      return res.status(404).json({ message: "Event not found or not yours" });
    }

    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;