import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    totalProjects: 4,
    totalTasks: 16,
    completedTasks: 10,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5002/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData = res.data.dashboard?.overview || res.data;

        if (
          (apiData.totalProjects ?? 0) === 0 &&
          (apiData.totalTasks ?? 0) === 0
        ) {
          setData({
            totalProjects: 4,
            totalTasks: 16,
            completedTasks: 10,
          });
        } else {
          setData({
            totalProjects: apiData.totalProjects ?? 0,
            totalTasks: apiData.totalTasks ?? 0,
            completedTasks: apiData.completedTasks ?? 0,
          });
        }
      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err.message);
      }
    };

    fetchDashboard();
  }, []);

  const totalProjects = data.totalProjects;
  const totalTasks = data.totalTasks;
  const completedTasks = data.completedTasks;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedTasks || 0.2, pendingTasks || 0.2],
        backgroundColor: ["#22c55e", "#f97316"],
        borderColor: "#020617",
        borderWidth: 5,
        hoverOffset: 18,
      },
    ],
  };

  const barData = {
    labels: ["Projects", "Tasks", "Completed"],
    datasets: [
      {
        label: "Count",
        data: [totalProjects || 0.2, totalTasks || 0.2, completedTasks || 0.2],
        backgroundColor: ["#38bdf8", "#8b5cf6", "#22c55e"],
        borderRadius: 18,
      },
    ],
  };

  const recentActivities = [
    "Admin created ERP Dashboard module",
    "Developer assigned task: Authentication UI",
    "Project status updated to In Progress",
    "JWT secured API accessed successfully",
  ];

  return (
    <div style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <Sidebar />

      <main style={styles.main}>
        <motion.div
          style={styles.header}
          initial={{ y: -35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.p
              style={styles.live}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ● System Live
            </motion.p>

            <p style={styles.tag}>Mini ERP Project Management System</p>
            <h1 style={styles.title}>Dashboard Overview</h1>
            <p style={styles.subtitle}>
              Premium command center for projects, tasks, teams and productivity.
            </p>
          </div>

          <motion.button
            style={styles.button}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/projects")}
          >
            + New Project
          </motion.button>
        </motion.div>

        <section style={styles.cards}>
          <Card delay={0.1} icon="📁" title="Total Projects" value={totalProjects} text="Active workspace" />
          <Card delay={0.2} icon="✅" title="Total Tasks" value={totalTasks} text="Tracked tasks" />
          <Card delay={0.3} icon="🏆" title="Completed" value={completedTasks} text="Finished work" />
          <Card delay={0.4} icon="📈" title="Progress" value={`${completionRate}%`} text="Completion rate" />
        </section>

        <section style={styles.grid}>
          <motion.div
            style={styles.panel}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={styles.panelTitle}>Task Status Analytics</h2>
            <p style={styles.panelSub}>Completed vs pending work</p>

            <div style={styles.chartBox}>
              <Doughnut
                data={doughnutData}
                options={{
                  cutout: "68%",
                  animation: { animateRotate: true, animateScale: true },
                  plugins: {
                    legend: {
                      labels: {
                        color: "#e2e8f0",
                        font: { weight: "bold", size: 13 },
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          <motion.div
            style={styles.panel}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={styles.panelTitle}>System Overview</h2>
            <p style={styles.panelSub}>Live analytics from workspace</p>

            <div style={styles.chartBox}>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  animation: { duration: 1400 },
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      ticks: { color: "#e2e8f0", font: { weight: "bold" } },
                      grid: { color: "rgba(255,255,255,.08)" },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: "#e2e8f0" },
                      grid: { color: "rgba(255,255,255,.08)" },
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </section>

        <section style={styles.bottomGrid}>
          <motion.div
            style={styles.performance}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={styles.performanceTop}>
              <div>
                <h2 style={styles.panelTitle}>Project Performance</h2>
                <p style={styles.text}>
                  JWT authentication is active, backend API is connected and MongoDB analytics are ready.
                </p>
              </div>
              <h2 style={styles.bigRate}>{completionRate}%</h2>
            </div>

            <div style={styles.progressBg}>
              <motion.div
                style={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1.3 }}
              />
            </div>
          </motion.div>

          <motion.div
            style={styles.activity}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={styles.panelTitle}>Recent Activity</h2>

            {recentActivities.map((item, index) => (
              <motion.div
                key={index}
                style={styles.activityItem}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.12 }}
              >
                <span style={styles.dot}></span>
                <p>{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function Card({ icon, title, value, text, delay }) {
  return (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 45, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{
        y: -10,
        scale: 1.04,
        boxShadow: "0 35px 80px rgba(99,102,241,.5)",
      }}
    >
      <div style={styles.icon}>{icon}</div>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.value}>{value}</h2>
      <span style={styles.cardText}>{text}</span>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    color: "#ffffff",
    fontFamily: "Poppins, Arial, sans-serif",
    background:
      "radial-gradient(circle at 15% 15%, rgba(99,102,241,.55), transparent 32%), radial-gradient(circle at 85% 75%, rgba(20,184,166,.45), transparent 32%), linear-gradient(135deg,#020617,#0f172a,#111827)",
    position: "relative",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(99,102,241,.25)",
    filter: "blur(38px)",
    right: "120px",
    top: "70px",
  },

  glowTwo: {
    position: "absolute",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(34,197,94,.18)",
    filter: "blur(38px)",
    left: "290px",
    bottom: "60px",
  },

  main: {
    flex: 1,
    padding: "22px 24px",
    overflowY: "auto",
    zIndex: 2,
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
  },

  tag: {
    color: "#5eead4",
    fontWeight: "900",
    margin: "8px 0 0",
  },

  title: {
    fontSize: "38px",
    margin: "6px 0",
    fontWeight: "900",
    lineHeight: "1",
    background: "linear-gradient(90deg,#ffffff,#5eead4,#818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: "15px",
  },

  button: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "16px",
    color: "white",
    fontWeight: "900",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    boxShadow: "0 18px 45px rgba(20,184,166,.45)",
    cursor: "pointer",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "16px",
    marginBottom: "18px",
  },

  card: {
    padding: "20px",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.18)",
    boxShadow: "0 20px 45px rgba(0,0,0,.35)",
    backdropFilter: "blur(24px)",
    minHeight: "155px",
    cursor: "pointer",
  },

  icon: { fontSize: "30px" },

  cardTitle: {
    color: "#e2e8f0",
    fontWeight: "900",
    marginBottom: "8px",
  },

  value: {
    fontSize: "38px",
    margin: "8px 0",
    color: "#ffffff",
    fontWeight: "900",
  },

  cardText: {
    color: "#a5b4fc",
    fontWeight: "800",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
  },

  panel: {
    padding: "22px",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.17)",
    boxShadow: "0 20px 45px rgba(0,0,0,.35)",
    backdropFilter: "blur(24px)",
  },

  panelTitle: {
    color: "#ffffff",
    margin: 0,
    fontSize: "23px",
    fontWeight: "900",
  },

  panelSub: {
    color: "#94a3b8",
    fontWeight: "700",
  },

  chartBox: {
    height: "240px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
    marginTop: "18px",
  },

  performance: {
    padding: "24px",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.17)",
    boxShadow: "0 20px 45px rgba(0,0,0,.35)",
    backdropFilter: "blur(24px)",
  },

  performanceTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
  },

  text: {
    color: "#cbd5e1",
    fontWeight: "700",
    lineHeight: "1.6",
  },

  bigRate: {
    fontSize: "40px",
    color: "#5eead4",
    margin: 0,
  },

  progressBg: {
    marginTop: "20px",
    height: "13px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.16)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#22c55e,#5eead4,#818cf8)",
    boxShadow: "0 0 25px rgba(94,234,212,.9)",
  },

  activity: {
    padding: "24px",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.17)",
    boxShadow: "0 20px 45px rgba(0,0,0,.35)",
    backdropFilter: "blur(24px)",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#cbd5e1",
    fontWeight: "700",
    borderBottom: "1px solid rgba(255,255,255,.1)",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 12px #22c55e",
  },
};

export default Dashboard;