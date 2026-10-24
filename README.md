# 🏆 Tournament Management System

A full-stack Tournament Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## 📁 Project Structure

```
capstone/
├── backend/                  # Node.js + Express API
│   ├── models/
│   │   ├── Admin.js          # Admin user schema
│   │   ├── Team.js           # Team schema
│   │   └── Match.js          # Match schema
│   ├── routes/
│   │   ├── auth.js           # Signup / Login routes
│   │   ├── teams.js          # Team CRUD routes
│   │   └── matches.js        # Match routes + points table
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protection middleware
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Entry point
│
└── frontend/                 # React.js + Vite app
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   └── PrivateRoute.jsx  # Route protection
    │   ├── pages/
    │   │   ├── Home.jsx          # Landing page
    │   │   ├── Login.jsx         # Admin login
    │   │   ├── Signup.jsx        # Admin signup
    │   │   ├── Dashboard.jsx     # Stats overview
    │   │   ├── Teams.jsx         # Team management
    │   │   ├── Matches.jsx       # Match management
    │   │   └── PointsTable.jsx   # Live standings
    │   ├── api.js                # Axios API calls
    │   ├── App.jsx               # Routes setup
    │   ├── index.css             # Global styles
    │   └── main.jsx              # React entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed on your computer:

1. **Node.js** (version 16 or higher) → [Download here](https://nodejs.org)
2. **MongoDB** (Community Edition) → [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional)

---

## 🚀 How to Run the Project

### Step 1 — Start MongoDB

Open a terminal and run:
```bash
mongod
```
> MongoDB must be running before you start the backend.

---

### Step 2 — Set Up the Backend

Open a **new terminal** and navigate to the backend folder:

```bash
cd capstone/backend
```

Install dependencies (skip if already done):
```bash
npm install
```

Start the backend server:
```bash
npm start
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
```

> The backend runs on: **http://localhost:5000**

---

### Step 3 — Set Up the Frontend

Open **another new terminal** and navigate to the frontend folder:

```bash
cd capstone/frontend
```

Install dependencies (skip if already done):
```bash
npm install
```

Start the frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

> The frontend runs on: **http://localhost:3000**

---

### Step 4 — Open the App

Open your browser and go to: **http://localhost:3000**

---

## 🔑 How to Use the App

1. **Sign Up** — Click "Create Account" and register as an admin
2. **Login** — Use your email and password to log in
3. **Dashboard** — See total teams, matches, and quick links
4. **Teams** — Add teams (e.g., "Chennai Super Kings", "CSK"), delete them
5. **Matches** — Create matches between teams, enter scores, results are calculated automatically
6. **Points Table** — View live rankings sorted by points and goal difference
7. **Logout** — Click the Logout button in the navbar

---

## 🏅 Points System

| Result | Points Awarded |
|--------|---------------|
| Win    | 3 points      |
| Draw   | 1 point       |
| Loss   | 0 points      |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register admin |
| POST | `/api/auth/login` | Login admin |
| GET  | `/api/auth/me` | Get logged in admin |

### Teams (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/teams` | Get all teams |
| POST   | `/api/teams` | Add a team |
| DELETE | `/api/teams/:id` | Delete a team |

### Matches (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/matches` | Get all matches |
| POST   | `/api/matches` | Create a match |
| PUT    | `/api/matches/:id/score` | Update match score |
| DELETE | `/api/matches/:id` | Delete a match |
| GET    | `/api/matches/points-table` | Get points table |

---

## 🛠 Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Build Tool | Vite 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Plain CSS (blue & white responsive design) |

---

## ⚠️ Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB service is running: `mongod` in a terminal
- Check that port 27017 is free

**"Cannot connect to backend" error in browser?**
- Ensure the backend is running on port 5000
- The Vite proxy in `vite.config.js` forwards `/api` requests to port 5000

**Port already in use?**
- Backend: Change `PORT=5001` in `backend/.env`
- Frontend: Change `port: 3001` in `frontend/vite.config.js`
