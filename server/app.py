# C:\dev\hacktrack_project\server\app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import os

app = Flask(__name__)

# ============================
# CORS
# ============================
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://hacktrack1-mu.vercel.app",
            ]
        }
    },
    supports_credentials=True,
)

# ============================
# SAMPLE DATA
# ============================
sample_hackathons = [
    {
        "id": 1,
        "title": "Global AI Hackathon 2024",
        "source": "devpost",
        "is_online": True,
        "status": "upcoming",
        "prize_amount": 25000,
    },
    {
        "id": 2,
        "title": "Climate Change Challenge",
        "source": "devpost",
        "is_online": False,
        "status": "open",
        "prize_amount": 15000,
    },
    {
        "id": 3,
        "title": "HackerEarth AI Challenge",
        "source": "hackerearth",
        "is_online": True,
        "status": "upcoming",
        "prize_amount": 10000,
    },
]

# ============================
# ROUTES
# ============================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})

@app.route("/api/hackathons", methods=["GET"])
def hackathons():
    source = request.args.get("source")
    status = request.args.get("status")
    online = request.args.get("online_only")

    data = list(sample_hackathons)

    if source:
        data = [h for h in data if h["source"] == source]
    if status:
        data = [h for h in data if h["status"] == status]
    if online == "true":
        data = [h for h in data if h["is_online"]]

    return jsonify({
        "hackathons": data,
        "total": len(data),
        "updated": int(time.time())
    })

# ============================
# START
# ============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Server running on port {port}")
    app.run(host="0.0.0.0", port=port)
