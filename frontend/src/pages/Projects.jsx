import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("planning");
  const [toast, setToast] = useState("");

  const API = "http://localhost:5002";
  const getToken = () => localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setProjects(res.data.projects || []);
    } catch (err) {
      console.log("Fetch projects error:", err.response?.data || err.message);
      setProjects([]);
    }
  };

  const createProject = async () => {
    if (!name || !description || !deadline) {
      showToast("Please fill all fields ❌");
      return;
    }

    try {
      await axios.post(
        `${API}/api/projects`,
        { name, description, deadline, status },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showToast("Project created successfully ✅");

      setName("");
      setDescription("");
      setDeadline("");
      setStatus("planning");

      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.message || "Project creation failed ❌");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const planningCount = projects.filter((p) => p.status === "planning").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  return (
    <div style={styles.page}>
      <Sidebar />

      {toast && (
        <motion.div
          style={styles.toast}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {toast}
        </motion.div>
      )}

      <main style={styles.main}>
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p style={styles.live}>● Project Workspace</p>
            <p style={styles.tag}>Project Management</p>
            <h1 style={styles.title}>Projects</h1>
            <p style={styles.subtitle}>
              Create, manage and track company projects from one premium workspace.
            </p>
          </div>

          <motion.button
            style={styles.dashboardBtn}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </motion.button>
        </motion.div>

        <motion.div
          style={styles.form}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            style={styles.input}
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            style={styles.input}
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <select
            style={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>

          <motion.button
            style={styles.createBtn}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={createProject}
          >
            + Create
          </motion.button>
        </motion.div>

        <section style={styles.summaryRow}>
          <Summary title="Total Projects" value={projects.length} />
          <Summary title="Active" value={activeCount} />
          <Summary title="Planning" value={planningCount} />
          <Summary title="Completed" value={completedCount} />
        </section>

        <section style={styles.grid}>
          {projects.length === 0 ? (
            <motion.div
              style={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No projects yet. Create your first project ✅
            </motion.div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project._id || index}
                style={styles.card}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{
                  scale: 1.03,
                  y: -7,
                  boxShadow: "0 35px 90px rgba(56,189,248,.45)",
                }}
              >
                <div style={styles.cardTop}>
                  <h2 style={styles.cardTitle}>{project.name}</h2>
                  <span style={getStatusStyle(project.status)}>
                    {project.status || "planning"}
                  </span>
                </div>

                <p style={styles.desc}>{project.description}</p>

                <div style={styles.info}>
                  <span>Deadline</span>
                  <b>{project.deadline?.slice(0, 10) || "Not set"}</b>
                </div>

                <div style={styles.info}>
                  <span>Created By</span>
                  <b>{project.createdBy?.name || "Admin"}</b>
                </div>

                <button style={styles.taskBtn} onClick={() => navigate("/tasks")}>
                  View Tasks →
                </button>
              </motion.div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function Summary({ title, value }) {
  return (
    <motion.div
      style={styles.summary}
      whileHover={{ scale: 1.025, y: -3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p style={styles.summaryTitle}>{title}</p>
      <h2 style={styles.summaryValue}>{value}</h2>
    </motion.div>
  );
}

const getStatusStyle = (status) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "900",
  textTransform: "capitalize",
  flexShrink: 0,
  color: "#fff",
  background:
    status === "completed"
      ? "rgba(34,197,94,.85)"
      : status === "active"
      ? "rgba(56,189,248,.85)"
      : status === "on-hold"
      ? "rgba(239,68,68,.85)"
      : "rgba(245,158,11,.9)",
});

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    color: "#f8fafc",
    fontFamily: "Poppins, Arial, sans-serif",
    background:
      "radial-gradient(circle at 18% 20%, rgba(99,102,241,.45), transparent 35%), radial-gradient(circle at 85% 80%, rgba(20,184,166,.35), transparent 35%), #020617",
  },

  toast: {
    position: "fixed",
    top: "22px",
    right: "22px",
    zIndex: 9999,
    padding: "14px 20px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    color: "#ffffff",
    fontWeight: "900",
    boxShadow: "0 18px 45px rgba(20,184,166,.45)",
  },

  main: {
    flex: 1,
    padding: "22px 24px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  live: {
    color: "#22c55e",
    fontWeight: "900",
    margin: 0,
    fontSize: "13px",
  },

  tag: {
    color: "#5eead4",
    fontWeight: "900",
    margin: "4px 0 0",
    fontSize: "14px",
  },

  title: {
    fontSize: "38px",
    margin: "3px 0",
    fontWeight: "900",
    lineHeight: "1.05",
    background: "linear-gradient(90deg,#ffffff,#5eead4,#818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#e2e8f0",
    fontWeight: "700",
    margin: 0,
    fontSize: "14px",
  },

  dashboardBtn: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "10px",
    padding: "14px",
    borderRadius: "22px",
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.15)",
    marginBottom: "16px",
    backdropFilter: "blur(20px)",
  },

  input: {
    padding: "11px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(15,23,42,.9)",
    color: "#f8fafc",
    outline: "none",
    fontWeight: "700",
    minWidth: 0,
  },

  createBtn: {
    padding: "11px 12px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 15px 35px rgba(20,184,166,.35)",
  },

  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "14px",
    marginBottom: "16px",
  },

  summary: {
    padding: "15px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 15px 35px rgba(0,0,0,.3)",
    color: "#f8fafc",
  },

  summaryTitle: {
    margin: 0,
    color: "#dbeafe",
    fontWeight: "800",
    fontSize: "14px",
  },

  summaryValue: {
    margin: "6px 0 0",
    color: "#ffffff",
    fontSize: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },

  card: {
    padding: "18px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 18px 42px rgba(0,0,0,.32)",
    minHeight: "195px",
    backdropFilter: "blur(22px)",
    color: "#f8fafc",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
  },

  cardTitle: {
    marginTop: 0,
    fontSize: "20px",
    color: "#ffffff",
    fontWeight: "900",
  },

  desc: {
    color: "#e5e7eb",
    minHeight: "42px",
    lineHeight: "1.45",
    fontWeight: "650",
    fontSize: "14px",
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    color: "#cbd5e1",
    fontSize: "13px",
    gap: "12px",
  },

  taskBtn: {
    marginTop: "14px",
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },

  empty: {
    gridColumn: "1 / -1",
    padding: "30px",
    textAlign: "center",
    borderRadius: "24px",
    background: "rgba(255,255,255,.1)",
    color: "#ffffff",
    fontWeight: "900",
    border: "1px solid rgba(255,255,255,.15)",
  },
};

export default Projects;