const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const players = [
  {
    id: 1,
    name: "Amey Nagesh",
    sport: "Football",
    city: "Thane",
    age: 19,
    score: 95,
    level: "District",
    strengths: ["Speed", "Stamina", "Decision Making"],
  },
  {
    id: 2,
    name: "Aarav Patil",
    sport: "Football",
    city: "Mumbai",
    age: 17,
    score: 91,
    level: "District",
    strengths: ["Speed", "Passing", "Stamina"],
  },
  {
    id: 3,
    name: "Riya Sharma",
    sport: "Cricket",
    city: "Pune",
    age: 18,
    score: 88,
    level: "State",
    strengths: ["Reflexes", "Shot Placement", "Consistency"],
  },
  {
    id: 4,
    name: "Kabir Deshmukh",
    sport: "Badminton",
    city: "Navi Mumbai",
    age: 16,
    score: 84,
    level: "School",
    strengths: ["Agility", "Footwork", "Reaction"],
  },
  {
    id: 5,
    name: "Meera Joshi",
    sport: "Athletics",
    city: "Thane",
    age: 19,
    score: 93,
    level: "National",
    strengths: ["Acceleration", "Balance", "Discipline"],
  },
];

app.get("/", (req, res) => {
  res.json({ message: "SportSense AI backend is running" });
});

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (email === "demo@sportsense.com" && password === "123456") {
    return res.json({
      success: true,
      message: "Login successful",
      role: role || "Athlete",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

app.get("/players", (req, res) => {
  res.json(players);
});

app.get("/players/:id", (req, res) => {
  const id = Number(req.params.id);
  const player = players.find((p) => p.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player not found" });
  }

  res.json(player);
});

app.get("/leaderboard", (req, res) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  res.json(sortedPlayers);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});