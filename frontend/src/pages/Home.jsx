import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Home() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoAnalysis, setVideoAnalysis] = useState(null);

  const [sport, setSport] = useState("Football");
  const [speed, setSpeed] = useState(70);
  const [endurance, setEndurance] = useState(70);
  const [reaction, setReaction] = useState(70);
  const [technique, setTechnique] = useState(70);

  const [notifications, setNotifications] = useState([
    "Welcome to SportSense AI",
    "System ready for athlete assessment",
  ]);

  const allOpportunities = [
    {
      title: "Under-19 Football Trials",
      org: "City Sports Academy",
      location: "Mumbai",
      sport: "Football",
      minScore: 75,
    },
    {
      title: "Women Cricket Skill Camp",
      org: "West Zone Talent Board",
      location: "Pune",
      sport: "Cricket",
      minScore: 70,
    },
    {
      title: "Athletics Screening Program",
      org: "Elite Track Center",
      location: "Thane",
      sport: "Athletics",
      minScore: 80,
    },
    {
      title: "Badminton Development Camp",
      org: "Shuttle Future Academy",
      location: "Navi Mumbai",
      sport: "Badminton",
      minScore: 68,
    },
  ];

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from("players").select("*");

      if (error) {
        console.error("Error fetching players:", error);
        return;
      }

      setPlayers(data || []);
    };

    fetchPlayers();
  }, []);

  const addNotification = (message) => {
    setNotifications((prev) => [message, ...prev].slice(0, 6));
  };

  const filteredPlayers = players.filter((player) => {
    const text = search.toLowerCase();
    return (
      player.name.toLowerCase().includes(text) ||
      player.sport.toLowerCase().includes(text) ||
      player.city.toLowerCase().includes(text)
    );
  });

  const talentScore = useMemo(() => {
    const weights = {
      Football: { speed: 0.3, endurance: 0.25, reaction: 0.2, technique: 0.25 },
      Cricket: { speed: 0.2, endurance: 0.2, reaction: 0.3, technique: 0.3 },
      Badminton: { speed: 0.25, endurance: 0.2, reaction: 0.3, technique: 0.25 },
      Athletics: { speed: 0.4, endurance: 0.3, reaction: 0.1, technique: 0.2 },
    };

    const w = weights[sport];

    const score =
      speed * w.speed +
      endurance * w.endurance +
      reaction * w.reaction +
      technique * w.technique;

    return Math.round(score);
  }, [sport, speed, endurance, reaction, technique]);

  const recommendation = useMemo(() => {
    if (talentScore >= 85) {
      return "Elite Potential — highly suitable for advanced trials and coach review.";
    }
    if (talentScore >= 70) {
      return "High Potential — suitable for development camps and district/state screening.";
    }
    if (talentScore >= 55) {
      return "Developing Athlete — shows promise but needs structured training improvement.";
    }
    return "Beginner Level — requires foundational skill development before competitive trials.";
  }, [talentScore]);

  const matchedOpportunities = useMemo(() => {
    return allOpportunities.filter(
      (item) => item.sport === sport && talentScore >= item.minScore
    );
  }, [sport, talentScore]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoAnalysis(null);
    addNotification(`Video selected: ${file.name}`);
  };

  const handleAnalyzeVideo = () => {
    if (!videoUrl) {
      alert("Please upload a video first.");
      return;
    }

    setIsAnalyzing(true);
    addNotification("Video analysis started");

    setTimeout(() => {
      const analyzedSpeed = Math.min(100, Math.max(40, speed + 4));
      const analyzedReaction = Math.min(100, Math.max(40, reaction + 3));
      const analyzedTechnique = Math.min(100, Math.max(40, technique + 2));
      const analyzedScore = Math.round(
        analyzedSpeed * 0.3 +
          endurance * 0.25 +
          analyzedReaction * 0.2 +
          analyzedTechnique * 0.25
      );

      setVideoAnalysis({
        speed: analyzedSpeed,
        reaction: analyzedReaction,
        technique: analyzedTechnique,
        score: analyzedScore,
      });

      setIsAnalyzing(false);
      addNotification(`Video analysis complete. Score generated: ${analyzedScore}`);
    }, 1800);
  };

  const openProfile = (player) => {
    navigate(`/athlete/${player.id}`);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApply = (title) => {
    addNotification(`Applied to ${title}`);
    alert(`Application started for: ${title}`);
  };

  const resetAssessment = () => {
    setSport("Football");
    setSpeed(70);
    setEndurance(70);
    setReaction(70);
    setTechnique(70);
    setVideoAnalysis(null);
    addNotification("Assessment inputs reset");
  };

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-card">
          <div className="badge">AI-Powered Sports Assessment Platform</div>
          <h1>SportSense AI</h1>
          <p className="hero-text">
            A smart platform for democratizing sports talent assessment through
            athlete profiles, intelligent scoring, performance tracking,
            leaderboard analytics, and opportunity discovery.
          </p>

          <p style={{ marginTop: "10px", color: "#a5b4fc" }}>
            Powered by a rule-based assessment engine with future scope for OpenCV and pose estimation
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection("assessment")}>
              Launch Demo
            </button>

            <button className="btn-secondary" onClick={() => scrollToSection("features")}>
              View Features
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <h2>10K+</h2>
              <p>Athlete Profiles</p>
            </div>
            <div className="stat-box">
              <h2>{talentScore}</h2>
              <p>Live Talent Score</p>
            </div>
            <div className="stat-box">
              <h2>{matchedOpportunities.length}</h2>
              <p>Matched Opportunities</p>
            </div>
            <div className="stat-box">
              <h2>{players.length}</h2>
              <p>Players in System</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <h2>Core Features</h2>
        <p className="section-sub">Working modules for your mini project.</p>

        <div className="grid">
          <div className="card">
            <h3>Video Upload + AI Simulation</h3>
            <p>Upload a sports performance clip, preview it, and run score simulation.</p>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              style={{ marginTop: "12px" }}
            />

            {videoUrl && (
              <video
                src={videoUrl}
                controls
                width="100%"
                style={{ marginTop: "14px", borderRadius: "12px" }}
              />
            )}

            <button
              className="btn-primary"
              style={{ marginTop: "14px" }}
              onClick={handleAnalyzeVideo}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Video"}
            </button>

            {videoAnalysis && (
              <div style={{ marginTop: "14px" }}>
                <p><strong>Speed:</strong> {videoAnalysis.speed}</p>
                <p><strong>Reaction:</strong> {videoAnalysis.reaction}</p>
                <p><strong>Technique:</strong> {videoAnalysis.technique}</p>
                <p style={{ color: "#1d4ed8", fontWeight: "bold" }}>
                  Video Score: {videoAnalysis.score}
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Intelligent Talent Scoring</h3>
            <p>
              The system calculates a talent score from speed, endurance,
              reaction, and technique using sport-specific weightage.
            </p>

            <button
              className="btn-primary"
              style={{ marginTop: "14px" }}
              onClick={() => scrollToSection("assessment")}
            >
              Open Assessment
            </button>
          </div>

          <div className="card">
            <h3>Leaderboard Analytics</h3>
            <p>Compare athletes by talent score and rank top performers.</p>

            <button
              className="btn-secondary"
              style={{ marginTop: "14px" }}
              onClick={() => navigate("/leaderboard")}
            >
              Open Leaderboard
            </button>
          </div>

          <div className="card">
            <h3>Opportunity Matching</h3>
            <p>
              Athletes are matched to relevant opportunities based on sport and talent score.
            </p>

            <button
              className="btn-secondary"
              style={{ marginTop: "14px" }}
              onClick={() => scrollToSection("opportunities")}
            >
              View Matches
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="assessment">
        <h2>AI-Based Talent Assessment</h2>
        <p className="section-sub">
          Enter athlete metrics to generate an intelligent sports talent score.
        </p>

        <div className="two-col">
          <div className="card">
            <h3>Athlete Input Panel</h3>

            <div style={{ marginTop: "16px" }}>
              <label>Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                style={selectStyle}
              >
                <option>Football</option>
                <option>Cricket</option>
                <option>Badminton</option>
                <option>Athletics</option>
              </select>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Speed: {speed}</label>
              <input type="range" min="0" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={rangeStyle} />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Endurance: {endurance}</label>
              <input type="range" min="0" max="100" value={endurance} onChange={(e) => setEndurance(Number(e.target.value))} style={rangeStyle} />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Reaction: {reaction}</label>
              <input type="range" min="0" max="100" value={reaction} onChange={(e) => setReaction(Number(e.target.value))} style={rangeStyle} />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label>Technique: {technique}</label>
              <input type="range" min="0" max="100" value={technique} onChange={(e) => setTechnique(Number(e.target.value))} style={rangeStyle} />
            </div>

            <button className="btn-secondary" style={{ marginTop: "18px" }} onClick={resetAssessment}>
              Reset Inputs
            </button>
          </div>

          <div className="card">
            <h3>Assessment Result</h3>

            <div style={{ marginTop: "18px" }}>
              <div className="metric">
                <div className="metric-head">
                  <span>Talent Score</span>
                  <span>{talentScore}/100</span>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: `${talentScore}%` }}></div>
                </div>
              </div>
            </div>

            <div className="tags" style={{ marginTop: "18px" }}>
              <span>{sport}</span>
              <span>
                {talentScore >= 85
                  ? "Elite Potential"
                  : talentScore >= 70
                  ? "High Potential"
                  : talentScore >= 55
                  ? "Developing"
                  : "Beginner"}
              </span>
            </div>

            <p style={{ marginTop: "18px", lineHeight: "1.7", color: "#475569" }}>
              {recommendation}
            </p>

            <button
              className="btn-primary"
              style={{ marginTop: "18px" }}
              onClick={() => {
                addNotification(`Assessment report generated for ${sport}`);
                alert(
                  `Assessment Complete\nSport: ${sport}\nTalent Score: ${talentScore}\nRecommendation: ${recommendation}`
                );
              }}
            >
              Generate Report
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="athletes">
        <h2>Athlete Discovery Dashboard</h2>
        <p className="section-sub">Search athletes and click any profile to view details.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by athlete, sport, or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <div
                className="card player-card"
                key={player.id}
                onClick={() => openProfile(player)}
                style={{ cursor: "pointer" }}
              >
                <div className="player-top">
                  <div>
                    <h3>{player.name}</h3>
                    <p>
                      {player.sport} • {player.city}
                    </p>
                  </div>
                  <div className="score">{player.score}</div>
                </div>

                <div className="tags">
                  <span>{player.level}</span>
                  <span>AI Verified</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <h3>No athletes found</h3>
              <p>Try searching with another name, sport, or city.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section two-col">
        <div className="card">
          <h2>Performance Analytics</h2>
          <p className="section-sub">Live assessment metrics based on current input.</p>

          <div className="metric">
            <div className="metric-head"><span>Speed</span><span>{speed}%</span></div>
            <div className="bar"><div className="fill" style={{ width: `${speed}%` }}></div></div>
          </div>

          <div className="metric">
            <div className="metric-head"><span>Endurance</span><span>{endurance}%</span></div>
            <div className="bar"><div className="fill" style={{ width: `${endurance}%` }}></div></div>
          </div>

          <div className="metric">
            <div className="metric-head"><span>Reaction</span><span>{reaction}%</span></div>
            <div className="bar"><div className="fill" style={{ width: `${reaction}%` }}></div></div>
          </div>

          <div className="metric">
            <div className="metric-head"><span>Technique</span><span>{technique}%</span></div>
            <div className="bar"><div className="fill" style={{ width: `${technique}%` }}></div></div>
          </div>
        </div>

        <div className="card" id="opportunities">
          <h2>Matched Opportunities</h2>
          <p className="section-sub">
            Opportunities filtered according to current sport and talent score.
          </p>

          <div className="opportunity-list">
            {matchedOpportunities.length > 0 ? (
              matchedOpportunities.map((item, index) => (
                <div className="opportunity-item" key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.org}</p>
                  <span className="location">{item.location}</span>
                  <p style={{ marginTop: "8px", color: "#475569" }}>
                    Minimum Score Required: {item.minScore}
                  </p>

                  <button
                    className="btn-secondary"
                    style={{ marginTop: "12px" }}
                    onClick={() => handleApply(item.title)}
                  >
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="opportunity-item">
                <h3>No matched opportunities yet</h3>
                <p>Improve the assessment inputs or choose another sport.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Notifications</h2>
        <p className="section-sub">System alerts and athlete activity updates.</p>

        <div className="card">
          <div className="notification-list">
            {notifications.map((note, index) => (
              <div key={index} className="notification-item">
                🔔 {note}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="footer-panel">
        <h2>Suggested Tech Stack</h2>
        <p>
          Frontend: React | Backend: Supabase | Database: PostgreSQL | AI Module: Python + OpenCV / MediaPipe
        </p>
      </section>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};

const rangeStyle = {
  width: "100%",
  marginTop: "8px",
};

export default Home;