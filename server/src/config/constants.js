// config/constants.js - Application constants
export const ROLES = {
    PENDING: "pending",
    STUDENT: "student",
    ORGANIZER: "organizer",
    ADMIN: "admin",
};

export const EVENT_PLATFORMS = ["clist", "devpost", "mlh", "eventbrite", "manual", "organizer"];
export const EVENT_TYPES = ["api", "manual"];
export const EVENT_STATUS = ["pending", "approved", "rejected"];

export const PRIZE_TYPES = ["cash", "scholarship", "goods", "unknown"];

export const MESSAGE_TYPES = ["text", "system", "invite"];

export const PARTICIPATION_STATUS = ["joined", "left"];

export const CACHE_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours

export const TIMEOUT_MS = 10000; // 10 seconds

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
