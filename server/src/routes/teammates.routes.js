import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import { getEmbedding } from "../utils/embeddingClient.js";
import { expensiveOperationLimiter } from "../middleware/rateLimiter.js";
import { cosineSimilarity } from "../utils/helpers.js";

const router = express.Router();

// Find teammates with filters
router.post("/find", auth, expensiveOperationLimiter, async (req, res) => {
  try {
    const { query, filters } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const queryEmb = await getEmbedding(query.trim());

    let userQuery = {
      profileEmbedding: { $exists: true, $ne: [] },
      _id: { $ne: req.user._id }
    };

    if (filters) {
      if (filters.college?.trim()) {
        userQuery.college = { $regex: filters.college.trim(), $options: "i" };
      }
      if (filters.location?.trim()) {
        userQuery.location = { $regex: filters.location.trim(), $options: "i" };
      }
      if (filters.domainInterest?.length > 0) {
        userQuery.domainInterest = { $in: filters.domainInterest.filter(d => d.trim()) };
      }
      if (filters.skills?.trim()) {
        const skillsArray = filters.skills.split(',').map(s => s.trim()).filter(s => s);
        if (skillsArray.length > 0) {
          userQuery.skills = { $in: skillsArray };
        }
      }
      if (filters.gradYearRange?.length === 2) {
        const [minYear, maxYear] = filters.gradYearRange;
        if (minYear && maxYear && minYear <= maxYear) {
          userQuery.graduationYear = { $gte: parseInt(minYear), $lte: parseInt(maxYear) };
        }
      }
    }

    const users = await User.find(
      userQuery,
      "name email bio skills interests college location graduationYear domainInterest preferredRoles profileEmbedding"
    ).lean();

    if (users.length === 0) {
      return res.json({ success: true, results: [], message: "No teammates found" });
    }

    const results = users.map((user) => {
      const similarity = cosineSimilarity(queryEmb, user.profileEmbedding);
      return { ...user, similarity, profileEmbedding: undefined };
    });

    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, 15);

    res.json({ success: true, results: topResults, count: topResults.length, totalMatches: results.length });
  } catch (err) {
    console.error("Find teammates error:", err);

    // Provide helpful error message if embedding service is down
    if (err.message.includes("Embedding service")) {
      return res.status(503).json({
        success: false,
        message: "AI teammate search is temporarily unavailable. Please check if the embedding service is configured correctly.",
        error: err.message
      });
    }

    res.status(500).json({ success: false, message: "Failed to search teammates", error: err.message });
  }
});

// AI Recommendations
router.post("/recommend", auth, expensiveOperationLimiter, async (req, res) => {
  try {
    const { filters = {} } = req.body;

    const currentUser = await User.findById(req.user._id).select(
      "name bio skills interests preferredRoles college location graduationYear domainInterest profileEmbedding"
    );

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!currentUser.profileEmbedding || currentUser.profileEmbedding.length === 0) {
      const profileText = [
        currentUser.bio,
        ...(currentUser.skills || []),
        ...(currentUser.interests || []),
        ...(currentUser.domainInterest || [])
      ].filter(Boolean).join(" ");

      if (!profileText.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please update your profile with skills or interests."
        });
      }

      const embedding = await getEmbedding(profileText);
      currentUser.profileEmbedding = embedding;
      await currentUser.save();
    }

    let query = {
      profileEmbedding: { $exists: true, $ne: [] },
      _id: { $ne: req.user._id },
    };

    if (filters.college?.trim()) {
      query.college = { $regex: filters.college.trim(), $options: "i" };
    }
    if (filters.location?.trim()) {
      query.location = { $regex: filters.location.trim(), $options: "i" };
    }
    if (filters.domainInterest?.length > 0) {
      query.domainInterest = { $in: filters.domainInterest.filter(d => d.trim()) };
    }
    if (filters.gradYearRange?.length === 2) {
      const [minYear, maxYear] = filters.gradYearRange;
      if (minYear && maxYear && minYear <= maxYear) {
        query.graduationYear = { $gte: parseInt(minYear), $lte: parseInt(maxYear) };
      }
    }
    if (filters.skills?.trim()) {
      const desiredSkills = filters.skills.split(',').map(s => s.trim()).filter(s => s);
      if (desiredSkills.length > 0) {
        query.skills = { $in: desiredSkills };
      }
    }

    const users = await User.find(query).select(
      "name bio skills interests preferredRoles college location graduationYear domainInterest profileEmbedding avatar xp level"
    ).limit(50);

    if (users.length === 0) {
      return res.json({ success: true, recommended: [], message: "No users found" });
    }

    const results = users.map((user) => {
      const profileSimilarity = cosineSimilarity(currentUser.profileEmbedding, user.profileEmbedding);

      const userSkills = new Set(user.skills || []);
      const currentUserSkills = new Set(currentUser.skills || []);
      const uniqueSkills = [...userSkills].filter(skill => !currentUserSkills.has(skill));
      const skillsComplementarity = Math.min(uniqueSkills.length / 10, 1);

      const userRoles = new Set(user.preferredRoles || []);
      const currentUserRoles = new Set(currentUser.preferredRoles || []);
      const sharedRoles = [...userRoles].filter(role => currentUserRoles.has(role));
      const uniqueRoles = [...userRoles].filter(role => !currentUserRoles.has(role));
      const roleComplementarity = (sharedRoles.length * 0.3 + uniqueRoles.length * 0.7) / Math.max(userRoles.size, 1);

      const userDomains = new Set(user.domainInterest || []);
      const currentUserDomains = new Set(currentUser.domainInterest || []);
      const sharedDomains = [...userDomains].filter(domain => currentUserDomains.has(domain));
      const domainAlignment = sharedDomains.length / Math.max(userDomains.size, 1);

      let filterBoost = 1;
      if (filters.college && user.college === currentUser.college) filterBoost += 0.2;
      if (filters.location && user.location === currentUser.location) filterBoost += 0.15;

      const score = (
        profileSimilarity * 0.4 +
        skillsComplementarity * 0.3 +
        roleComplementarity * 0.2 +
        domainAlignment * 0.1
      ) * filterBoost;

      const matchReasons = [];
      if (profileSimilarity > 0.7) matchReasons.push("High profile compatibility");
      if (uniqueSkills.length > 0) matchReasons.push(`Adds skills: ${uniqueSkills.slice(0, 3).join(", ")}`);
      if (sharedRoles.length > 0) matchReasons.push(`Shared roles: ${sharedRoles.slice(0, 2).join(", ")}`);
      if (user.college === currentUser.college) matchReasons.push("Same college");

      return {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        college: user.college,
        location: user.location,
        graduationYear: user.graduationYear,
        domainInterest: user.domainInterest,
        skills: user.skills,
        preferredRoles: user.preferredRoles,
        interests: user.interests,
        xp: user.xp,
        level: user.level,
        similarity: profileSimilarity,
        score,
        matchReasons: matchReasons.slice(0, 4)
      };
    });

    results.sort((a, b) => b.score - a.score);
    const topRecommendations = results.slice(0, 8);

    res.json({
      success: true,
      recommended: topRecommendations,
      metrics: {
        totalConsidered: users.length,
        totalRecommended: topRecommendations.length
      }
    });
  } catch (err) {
    console.error("Recommend teammates error:", err);
    res.status(500).json({ success: false, message: "Failed to generate recommendations" });
  }
});

// Auto team formation
router.get("/form-teams", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    const allUsers = await User.find(
      { profileEmbedding: { $exists: true, $ne: [] } },
      "name bio skills preferredRoles profileEmbedding"
    ).limit(limit);

    if (allUsers.length < 3) {
      return res.status(400).json({ message: "Not enough users to form teams." });
    }

    const matrix = [];
    for (let i = 0; i < allUsers.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < allUsers.length; j++) {
        matrix[i][j] = i === j ? 0 : cosineSimilarity(allUsers[i].profileEmbedding, allUsers[j].profileEmbedding);
      }
    }

    const used = new Set();
    const teams = [];

    for (let i = 0; i < allUsers.length; i++) {
      if (used.has(i)) continue;

      let bestCombo = null;
      let bestScore = -1;

      for (let j = i + 1; j < allUsers.length; j++) {
        if (used.has(j)) continue;
        for (let k = j + 1; k < allUsers.length; k++) {
          if (used.has(k)) continue;

          const simAvg = (matrix[i][j] + matrix[i][k] + matrix[j][k]) / 3;
          const roles = new Set([
            ...allUsers[i].preferredRoles,
            ...allUsers[j].preferredRoles,
            ...allUsers[k].preferredRoles,
          ]);
          const diversity = roles.size / 3;
          const score = simAvg * 0.7 + diversity * 0.3;

          if (score > bestScore) {
            bestScore = score;
            bestCombo = [i, j, k];
          }
        }
      }

      if (bestCombo) {
        teams.push({
          members: bestCombo.map((idx) => ({
            name: allUsers[idx].name,
            roles: allUsers[idx].preferredRoles,
            skills: allUsers[idx].skills,
          })),
          teamScore: bestScore.toFixed(3),
        });
        bestCombo.forEach((idx) => used.add(idx));
      }
    }

    res.json({ success: true, teams });
  } catch (err) {
    console.error("Team formation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
