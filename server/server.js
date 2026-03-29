// server.js
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./src/config/db.js";
import { config } from "./src/config/env.js";
import { errorHandler } from "./src/middleware/error.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import initPassport from "./src/config/passport.js";

// Middleware
import { apiLimiter, authLimiter } from "./src/middleware/rateLimiter.js";

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
import healthRoutes from "./src/routes/health.routes.js";

// Models
import Event from "./src/models/Event.js";

// Controllers
import { getLiveMLH, getMLHHealth } from "./src/controllers/events.controller.js";

const app = express();

// DB Connect
await connectDB();
console.log("✅ MongoDB Connected");

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hacktrack1-mu.vercel.app",
  "https://hacktrack-frontend.vercel.app",
  "https://hacktrack-client.vercel.app",
];

console.log("🌐 Allowed CORS origins:", allowedOrigins.join(", "));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or ends with .vercel.app
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, origin); // Return the actual origin, not just true
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session with MongoDB Store (Fixed)
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URI,
      touchAfter: 24 * 3600, // Lazy session update
      crypto: {
        secret: config.SESSION_SECRET
      }
    }),
    cookie: {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (_req, res) => res.json({ status: "HackTrack API running" }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/events", apiLimiter, eventsRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/organizer", apiLimiter, organizerRoutes);
app.use("/api/contests", apiLimiter, contestsRoutes);
app.use("/api/participation", apiLimiter, participationRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/teammates", apiLimiter, teammatesRoutes);
app.use("/api/invitations", apiLimiter, invitationRoutes);
app.use("/api/chats", apiLimiter, chatRoutes);

app.get("/api/events/mlh", getLiveMLH);
app.get("/api/events/mlh/health", getMLHHealth);

app.get("/api/debug/schema", (_req, res) => {
  res.json({
    model: Event.modelName,
    fields: Object.keys(Event.schema.paths),
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
