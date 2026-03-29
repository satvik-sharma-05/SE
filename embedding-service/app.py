from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model
print("🚀 Loading sentence-transformers model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Model loaded: all-MiniLM-L6-v2 (384 dimensions)")

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

# Routes
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "embedding-service",
        "status": "running",
        "model": "all-MiniLM-L6-v2",
        "dimensions": 384
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": "all-MiniLM-L6-v2",
        "dimensions": 384
    })

@app.route("/embed", methods=["POST"])
def embed():
    try:
        data = request.get_json(force=True)
        text = data.get("text", "")

        if isinstance(text, (list, dict)):
            text = " ".join(map(str, text.values() if isinstance(text, dict) else text))

        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "Invalid text"}), 400

        # Generate embedding using sentence-transformers
        embedding = model.encode(text, convert_to_numpy=True)
        
        return jsonify({"embedding": embedding.tolist()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/similarity", methods=["POST"])
def similarity():
    try:
        data = request.get_json(force=True)
        v1 = data.get("vec1")
        v2 = data.get("vec2")

        if not v1 or not v2:
            return jsonify({"error": "Missing vectors"}), 400
        
        if len(v1) != len(v2):
            return jsonify({"error": "Vector dimensions must match"}), 400

        score = cosine_similarity(v1, v2)
        
        return jsonify({"similarity": float(score)})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5002))
    print(f"🚀 Embedding Service running on port {port}")
    print(f"📦 Model: all-MiniLM-L6-v2 (384 dimensions)")
    app.run(host="0.0.0.0", port=port, debug=False)
