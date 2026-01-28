# hacktrack_project/embedding-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# ============================
# CORS
# ============================
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://hacktrack1-mu.vercel.app",
                "https://hacktrack-1.onrender.com",
            ]
        }
    }
)

# ============================
# LOAD MODEL (ONCE)
# ============================
print("🧠 Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ Model loaded")

# ============================
# ROUTES
# ============================

@app.route("/", methods=["GET"])
def home():
    return jsonify({"service": "embedding-service", "status": "running"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})

@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json(force=True)
    text = data.get("text", "")

    if isinstance(text, (list, dict)):
        text = " ".join(map(str, text.values() if isinstance(text, dict) else text))

    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Invalid text"}), 400

    embedding = model.encode(text).tolist()
    return jsonify({"embedding": embedding})

@app.route("/similarity", methods=["POST"])
def similarity():
    data = request.get_json(force=True)
    v1 = data.get("vec1")
    v2 = data.get("vec2")

    if not v1 or not v2 or len(v1) != len(v2):
        return jsonify({"error": "Invalid vectors"}), 400

    score = cosine_similarity([v1], [v2])[0][0]
    return jsonify({"similarity": float(score)})

# ============================
# START
# ============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    print(f"🚀 Embedding Service running on port {port}")
    app.run(host="0.0.0.0", port=port)
