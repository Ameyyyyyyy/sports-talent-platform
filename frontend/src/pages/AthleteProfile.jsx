import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function AthleteProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPlayer(data);
      }

      setLoading(false);
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="profile-card">
          <h1>Loading athlete profile...</h1>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="page-wrap">
        <div className="profile-card">
          <h1>Player not found</h1>
        </div>
      </div>
    );
  }

  const recommendation =
    player.score >= 90
      ? "Elite athlete profile. Strong candidate for advanced trials and professional coaching review."
      : player.score >= 75
      ? "High-potential athlete with strong development prospects."
      : "Promising athlete with scope for improvement through structured training.";

  return (
    <div className="page-wrap">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {player.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>

          <div>
            <h1>{player.name}</h1>
            <p>{player.sport} • {player.city} • Age {player.age}</p>
            <p style={{ marginTop: "6px", color: "#64748b" }}>
              Level: {player.level}
            </p>
          </div>

          <div className="score big-score">{player.score}</div>
        </div>

        <div className="profile-grid">
          <div className="card">
            <h2>About Athlete</h2>
            <p>
              {player.name} is a promising {player.sport.toLowerCase()} athlete from {player.city}.
            </p>
          </div>

          <div className="card">
            <h2>Strengths</h2>
            <div className="tags">
              {player.strengths.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>AI Recommendation</h2>
            <p>{recommendation}</p>
            <button
              className="btn-secondary"
              style={{ marginTop: "12px" }}
              onClick={() => navigate("/leaderboard")}
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AthleteProfile;