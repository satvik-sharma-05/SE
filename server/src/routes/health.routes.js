// routes/health.routes.js
import express from "express";
import mongoose from "mongoose";
import { getDevpostCacheMetadata } from "../services/devpost.service.js";
import { getMLHCacheMetadata } from "../services/mlhService.js";

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get("/", async (req, res) => {
    try {
        const health = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            services: {
                database: "unknown",
                devpostCache: "unknown",
                mlhCache: "unknown",
            }
        };

        // Check database connection
        try {
            if (mongoose.connection.readyState === 1) {
                health.services.database = "connected";
            } else {
                health.services.database = "disconnected";
                health.status = "degraded";
            }
        } catch (err) {
            health.services.database = "error";
            health.status = "degraded";
        }

        // Check Devpost cache
        try {
            const devpostMeta = getDevpostCacheMetadata();
            health.services.devpostCache = devpostMeta.status || "unknown";
        } catch (err) {
            health.services.devpostCache = "error";
        }

        // Check MLH cache
        try {
            const mlhMeta = getMLHCacheMetadata();
            health.services.mlhCache = mlhMeta.exists ? "healthy" : "missing";
        } catch (err) {
            health.services.mlhCache = "error";
        }

        const statusCode = health.status === "healthy" ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (err) {
        console.error("Health check error:", err);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: err.message
        });
    }
});

/**
 * Detailed status endpoint (for monitoring)
 * GET /api/health/status
 */
router.get("/status", async (req, res) => {
    try {
        const status = {
            server: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                nodeVersion: process.version,
                platform: process.platform,
            },
            database: {
                status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
                host: mongoose.connection.host,
                name: mongoose.connection.name,
            },
            caches: {
                devpost: getDevpostCacheMetadata(),
                mlh: getMLHCacheMetadata(),
            }
        };

        res.json({ success: true, status });
    } catch (err) {
        console.error("Status check error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve status",
            error: err.message
        });
    }
});

export default router;
