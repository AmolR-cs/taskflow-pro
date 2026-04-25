import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Enter email & password ❌");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
      "https://taskflow-pro-backend-9xaa.onrender.com/api/auth/login", 
        { email, password }
      );

      // ✅ Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Show message (no alert)
      setMessage("Login successful ✅");

      // ✅ Redirect after 1 sec
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h1 style={styles.logo}>TaskFlow Pro</h1>
        <p style={styles.sub}>Mini ERP Project Management System</p>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.text}>
          Login to manage projects, tasks, team & analytics
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          {loading ? "Logging..." : "Login Securely →"}
        </button>

        {/* ✅ MESSAGE UI */}
        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footer}>
          JWT Auth • MongoDB • Secure Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#020617,#0f172a,#111827)",
    color: "#fff",
  },

  box: {
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  logo: {
    fontWeight: "900",
    fontSize: "28px",
    background: "linear-gradient(90deg,#5eead4,#818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  sub: { color: "#94a3b8", marginBottom: "15px" },

  title: { margin: "10px 0" },

  text: { color: "#cbd5e1", fontSize: "14px" },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "900",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    color: "#fff",
    cursor: "pointer",
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  footer: {
    marginTop: "12px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default Login;