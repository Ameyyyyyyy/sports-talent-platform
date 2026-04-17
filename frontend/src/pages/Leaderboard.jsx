import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("score", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPlayers(data);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="profile-card">
          <h1>Loading leaderboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="profile-card">
        <h1>Leaderboard</h1>
        <p className="section-sub">Top-ranked athletes by talent score</p>

        <div className="leaderboard-list">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="leaderboard-item"
              onClick={() => navigate(`/athlete/${player.id}`)}
            >
              <div className="leader-rank">#{index + 1}</div>
              <div className="leader-main">
                <h3>{player.name}</h3>
                <p>{player.sport} • {player.city} • {player.level}</p>
              </div>
              <div className="leader-score">{player.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;