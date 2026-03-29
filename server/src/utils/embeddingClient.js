// Embedding client for sentence-transformers service
import fetch from "node-fetch";

const EMBEDDING_URL = process.env.EMBEDDING_URL || "http://localhost:5002";
const TIMEOUT_MS = 10000;

console.log("🔗 Embedding service URL:", EMBEDDING_URL);

export async function getEmbedding(text) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${EMBEDDING_URL}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Embedding service error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (err) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      console.error("⏱️ Embedding service timeout after", TIMEOUT_MS, "ms");
      console.error("💡 Check EMBEDDING_URL environment variable:", EMBEDDING_URL);
      throw new Error("Embedding service timeout - check if service is running");
    }

    console.error("❌ Embedding service error:", err.message);
    console.error("💡 Current EMBEDDING_URL:", EMBEDDING_URL);
    console.error("💡 Expected URL: https://hacktrack-embedding.onrender.com");
    throw new Error(`Embedding service unavailable: ${err.message}`);
  }
}
