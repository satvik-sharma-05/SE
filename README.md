<div align="center">

# 🚀 HackTrack

### AI-Powered Hackathon Discovery & Team Formation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)

**[🌐 Live Demo](https://hacktrack-frontend.vercel.app)** • **[📖 Deployment Guide](DEPLOY.md)** • **[🔗 Backend API](https://hacktrack-server-674s.onrender.com/api)** • **[🤖 AI Service](https://hacktrack-embedding.onrender.com)**

---

### 🎯 Discover • Connect • Build • Win

*The ultimate platform for hackathon enthusiasts to find events, form dream teams, and build award-winning projects*

</div>

---

## 🌟 Live Deployment

<table>
<tr>
<td align="center" width="33%">
<h3>🎨 Frontend</h3>
<p><a href="https://hacktrack-frontend.vercel.app">hacktrack-frontend.vercel.app</a></p>
<p><sub>Deployed on Vercel</sub></p>
</td>
<td align="center" width="33%">
<h3>⚙️ Backend</h3>
<p><a href="https://hacktrack-server-674s.onrender.com/api">hacktrack-server-674s.onrender.com</a></p>
<p><sub>Deployed on Render</sub></p>
</td>
<td align="center" width="33%">
<h3>🤖 AI Service</h3>
<p><a href="https://hacktrack-embedding.onrender.com">hacktrack-embedding.onrender.com</a></p>
<p><sub>Deployed on Render</sub></p>
</td>
</tr>
</table>

---

## ✨ Key Features

### 🎪 For Participants

- 🔍 **500+ Hackathons** - Aggregated from Devpost, MLH, and Clist
- 🤖 **AI Teammate Matching** - Sentence-transformers powered recommendations
- 💬 **Real-time Chat** - Socket.io for instant team communication
- 📚 **Smart Bookmarks** - Save and organize favorite events
- 📊 **Personal Dashboard** - Track your hackathon journey
- 🏆 **Portfolio Building** - Showcase your achievements

### 🎯 For Organizers

- 📅 **Event Management** - Create and manage hackathons
- 📈 **Analytics Dashboard** - Track engagement and registrations
- 👥 **Participant Management** - Review submissions and teams
- 📢 **Promotion Tools** - Reach thousands of developers
- 💼 **Professional Profile** - Build your organizer brand

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool
- **TailwindCSS 3** - Styling
- **shadcn/ui** - Component library
- **React Router 6** - Navigation
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js 18** - Runtime
- **Express 4** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose 8** - ODM
- **Passport.js** - Authentication (Google, GitHub, LinkedIn OAuth)
- **JWT** - Token-based auth
- **Socket.io** - WebSocket server
- **Express Session** - Session management

### AI Service
- **Python 3.12.8** - Runtime
- **Flask 3** - Web framework
- **Sentence-Transformers 3.3** - Embeddings (all-MiniLM-L6-v2)
- **PyTorch 2.5** - ML framework (CPU-only)
- **NumPy 2.2** - Numerical computing

---

## 🚀 Quick Start

### Prerequisites

```bash
✅ Node.js 18+
✅ MongoDB (local or Atlas)
✅ Python 3.12+ (for AI features)
```

### Installation

```bash
# Clone repository
git clone https://github.com/satvik-sharma-05/SE.git
cd SE

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install

# Install AI service
cd ../embedding-service
pip install -r requirements.txt
```

### Configuration

Create `server/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/hacktrack

# Authentication
JWT_SECRET=your_jwt_secret_min_32_chars
SESSION_SECRET=your_session_secret

# URLs
FRONTEND_URL=http://localhost:5173
EMBEDDING_URL=http://localhost:5002

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Event Sources
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run Development

```bash
# Terminal 1 - AI Service
cd embedding-service
python app.py

# Terminal 2 - Backend
cd server
npm run dev

# Terminal 3 - Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
hacktrack/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # API clients
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utilities
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, validation
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utilities
│   ├── .env                  # Environment variables
│   └── package.json
│
├── embedding-service/         # Python AI service
│   ├── app.py                # Flask app
│   └── requirements.txt      # Dependencies
│
├── README.md                 # This file
└── DEPLOY.md                 # Deployment guide
```

---

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register user
POST   /api/auth/login             # Login user
GET    /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user
GET    /api/auth/google            # Google OAuth
GET    /api/auth/github            # GitHub OAuth
GET    /api/auth/linkedin          # LinkedIn OAuth
```

### Events
```
GET    /api/events/live            # Get live events (all sources)
GET    /api/events/mlh             # Get MLH events
GET    /api/events/devpost         # Get Devpost events
GET    /api/events/:id             # Get event by ID
POST   /api/events/:id/bookmark    # Bookmark event
```

### AI Teammates
```
POST   /api/teammates/find         # Search teammates
POST   /api/teammates/recommend    # Get AI recommendations
GET    /api/teammates/form-teams   # Auto team formation
```

### Users
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
GET    /api/users/:id              # Get public profile
```

### Chat
```
GET    /api/chats                  # Get user chats
POST   /api/chats                  # Create chat
GET    /api/chats/:id/messages     # Get messages
POST   /api/chats/:id/messages     # Send message
```

---

## 🚀 Deployment

See **[DEPLOY.md](DEPLOY.md)** for detailed deployment instructions.

### Quick Deploy

All services auto-deploy on push to `main` branch:

```bash
git push origin main
```

### Production URLs

- **Frontend**: https://hacktrack-frontend.vercel.app
- **Backend**: https://hacktrack-server-674s.onrender.com/api
- **AI Service**: https://hacktrack-embedding.onrender.com

### Environment Variables (Render)

Set these in Render Dashboard → Environment:

```
EMBEDDING_URL=https://hacktrack-embedding.onrender.com
FRONTEND_URL=https://hacktrack-frontend.vercel.app
GOOGLE_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/github/callback
LINKEDIN_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/linkedin/callback
```

---

## 🤖 AI Features

### Sentence-Transformers

We use **all-MiniLM-L6-v2** model for high-quality embeddings:

- **384 dimensions** - Compact yet powerful
- **CPU-only PyTorch** - No GPU required, fast inference
- **Cosine similarity** - Accurate teammate matching
- **Sub-second response** - Real-time recommendations

### Teammate Matching Algorithm

1. Generate user profile embeddings (skills + interests + bio)
2. Compute cosine similarity with all users
3. Apply filters (location, college, graduation year)
4. Rank by similarity score
5. Return top 15 matches

---

## 📊 Performance

- **API Response**: < 100ms average
- **Page Load**: < 1.5s
- **AI Inference**: < 500ms
- **Memory Usage**: ~150MB total
- **Cold Start**: < 30s (free tier)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Clist API** - Contest listings
- **Devpost** - Hackathon data
- **MLH** - Major League Hacking events
- **Shadcn/ui** - Beautiful UI components
- **Vercel & Render** - Hosting platforms
- **Sentence-Transformers** - State-of-the-art embeddings

---

## 📞 Contact

**GitHub**: [@satvik-sharma-05](https://github.com/satvik-sharma-05)

**Repository**: [https://github.com/satvik-sharma-05/SE](https://github.com/satvik-sharma-05/SE)

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star!

**[⬆ Back to Top](#-hacktrack)**

</div>
