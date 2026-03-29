# embedding-service/app.py - Lightweight with HashingVectorizer
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

app = Flask(__name__)

# CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize HashingVectorizer (lightweight, no model download needed!)
print("🚀 Initializing HashingVectorizer...")
vectorizer = HashingVectorizer(
    n_features=384,  # Same dimension as sentence-transformers for compatibility
    norm='l2',
    alternate_sign=False
)
print("✅ Vectorizer ready")

# Routes
@app.route("/", methods=["GET"])
def home():
    return jsonify({"service": "embedding-service", "status": "running", "model": "HashingVectorizer"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "model": "HashingVectorizer"})

@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json(force=True)
    text = data.get("text", "")

    if isinstance(text, (list, dict)):
        text = " ".join(map(str, text.values() if isinstance(text, dict) else text))

    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Invalid text"}), 400

    # Generate embedding using HashingVectorizer
    embedding = vectorizer.transform([text.lower()]).toarray()[0].tolist()
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    print(f"🚀 Embedding Service running on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
