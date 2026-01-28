// server.js
import express from "express";
import session from "express-session";
import { connectDB } from "./src/config/db.js";
import { config } from "./src/config/env.js";
import { errorHandler } from "./src/middleware/error.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import initPassport from "./src/config/passport.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import eventsRoutes from "./src/routes/events.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import contestsRoutes from "./src/routes/contests.routes.js";
import organizerRoutes from "./src/routes/organizer.routes.js";
import participationRoutes from "./src/routes/participation.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import teammatesRoutes from "./src/routes/teammates.routes.js";
import invitationRoutes from "./src/routes/invitations.js";
import chatRoutes from "./src/routes/chats.js";

// Models
import Event from "./src/models/Event.js";

// Controllers
import { getLiveMLH, getMLHHealth } from "./src/controllers/events.controller.js";

// ----------------------------------------------------
// ✅ INIT APP
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// ✅ DB CONNECT
// ----------------------------------------------------
await connectDB();
console.log("✅ MongoDB Connected");

// ----------------------------------------------------
// ✅ SECURITY & MIDDLEWARE
// ----------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://hacktrack1-mu.vercel.app",
  "https://hacktrack1-mu.vercel.app/", // include slash
];


app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------------------------------------------
// ✅ SESSION + PASSPORT
// ----------------------------------------------------
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------------------
// ✅ ROUTES
// ----------------------------------------------------
app.get("/", (_req, res) =>
  res.json({ status: "HackTrack API running" })
);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/contests", contestsRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teammates", teammatesRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/chats", chatRoutes);

// MLH health (READ ONLY)
app.get("/api/events/mlh", getLiveMLH);
app.get("/api/events/mlh/health", getMLHHealth);

// Debug
app.get("/api/debug/schema", (_req, res) => {
  res.json({
    model: Event.modelName,
    fields: Object.keys(Event.schema.paths),
  });
});

// ----------------------------------------------------
// ✅ ERROR HANDLER
// ----------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------
// ✅ START SERVER
// ----------------------------------------------------
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
