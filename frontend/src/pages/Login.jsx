import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [role, setRole] = useState("Athlete");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(`${role} login successful ✅`);

    if (role === "Athlete") {
      navigate("/athlete/1");
    } else if (role === "Coach") {
      navigate("/");
    } else {
      navigate("/leaderboard");
    }
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful. Check your email if confirmation is enabled.");
  };

  return (
    <div className="page-wrap">
      <div className="login-card">
        <h1>Login</h1>
        <p className="section-sub">Sign in as Athlete, Coach, or Scout</p>

        <form onSubmit={handleLogin} className="login-form">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="login-select"
          >
            <option>Athlete</option>
            <option>Coach</option>
            <option>Scout</option>
          </select>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-primary full-btn">
            Login
          </button>

          <button
            type="button"
            className="btn-secondary full-btn"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;