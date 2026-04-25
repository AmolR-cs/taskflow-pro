import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const API = "https://taskflow-pro-backend-9nxa.onrender.com";
  const getToken = () => localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const projectRes = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const taskRes = await axios.get(`${API}/api/tasks`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setProjects(projectRes.data.projects || []);
      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      console.log("Analytics error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  const todo = tasks.filter((t) => t.status === "todo").length;
  const progress = tasks.filter((t) => t.status === "in-progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const high = tasks.filter((t) => t.priority === "high").length;
  const medium = tasks.filter((t) => t.priority === "medium").length;
  const low = tasks.filter((t) => t.priority === "low").length;

  const completionRate =
    tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);

  const displayTodo = todo === 0 ? 0.2 : todo;
  const displayProgress = progress === 0 ? 0.2 : progress;
  const displayDone = done === 0 ? 0.2 : done;

  const displayHigh = high === 0 ? 0.2 : high;
  const displayMedium = medium === 0 ? 0.2 : medium;
  const displayLow = low === 0 ? 0.2 : low;

  const statusData = {
    labels: ["Todo", "In Progress", "Done"],
    datasets: [
      {
        data: [displayTodo, displayProgress, displayDone],
        backgroundColor: ["#38bdf8", "#f59e0b", "#22c55e"],
        borderColor: "#020617",
        borderWidth: 6,
        hoverOffset: 18,
      },
    ],
  };

  const priorityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks",
        data: [displayHigh + 0.5, displayMedium + 0.5, displayLow + 0.5],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
        borderRadius: 16,
      },
    ],
  };

  const projectData = {
    labels: ["Projects", "Tasks", "Completed"],
    datasets: [
      {
        label: "Workspace",
        data: [projects.length || 0.2, tasks.length || 0.2, done || 0.2],
        backgroundColor: ["#38bdf8", "#8b5cf6", "#22c55e"],
        borderRadius: 16,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          font: { weight: "bold" },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1200,
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          font: { weight: "bold" },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,.08)" },
      },
      y: {
        ticks: { color: "#e2e8f0" },
        grid: { color: "rgba(255,255,255,.08)" },
      },
    },
  };

  return (
    <div style={styles.page}>
      <Sidebar active="Analytics" />

      <main style={styles.main}>
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p style={styles.live}>● Live Analytics</p>
            <p style={styles.tag}>Analytics Dashboard</p>
            <h1 style={styles.title}>Insights & Reports</h1>
            <p style={styles.subtitle}>
              Real-time project, task and productivity analytics for your ERP workspace.
            </p>
          </div>

          <motion.button
            style={styles.dashboardBtn}
            whileHover={{ scale: 1.05 }}
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </motion.button>
        </motion.div>

        <section style={styles.summaryRow}>
          <Summary title="Total Projects" value={projects.length} />
          <Summary title="Total Tasks" value={tasks.length} />
          <Summary title="Completed" value={done} />
          <Summary title="Completion Rate" value={`${completionRate}%`} />
        </section>

        <section style={styles.chartGrid}>
          <Panel title="Task Status" sub="Todo vs Progress vs Done">
            <div style={styles.donutWrap}>
              <Doughnut data={statusData} options={chartOptions} />
              <div style={styles.centerText}>
                <h2 style={styles.centerPercent}>{completionRate}%</h2>
                <p style={styles.centerLabel}>Done</p>
              </div>
            </div>
          </Panel>

          <Panel title="Task Priority" sub="High, medium and low priority work">
            <Bar data={priorityData} options={barOptions} />
          </Panel>
        </section>

        <section style={styles.bottomGrid}>
          <Panel title="Workspace Overview" sub="Projects, tasks and completed work">
            <Bar data={projectData} options={barOptions} />
          </Panel>

          <motion.div
            style={styles.performance}
            whileHover={{
              scale: 1.02,
              y: -6,
              boxShadow: "0 30px 70px rgba(99,102,241,.45)",
            }}
          >
            <div style={styles.performanceTop}>
              <div>
                <h2 style={styles.panelTitle}>Performance Score</h2>
                <p style={styles.panelSub}>Based on completed task ratio</p>
              </div>
              <h2 style={styles.bigRate}>{completionRate}%</h2>
            </div>

            <div style={styles.progressBg}>
              <motion.div
                style={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <div style={styles.activityBox}>
              <p style={styles.activity}>● JWT secured analytics API</p>
              <p style={styles.activity}>● MongoDB live data connected</p>
              <p style={styles.activity}>● Task status syncing every 5 seconds</p>
              <p style={styles.activity}>● Responsive dashboard layout active</p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function Sidebar({ active }) {
  const items = ["Dashboard", "Projects", "Tasks", "Team", "Analytics"];

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>TaskFlow Pro</h2>

      {items.map((item) => (
        <div
          key={item}
          style={active === item ? styles.active : styles.menu}
          onClick={() => (window.location.href = `/${item.toLowerCase()}`)}
        >
          {item}
        </div>
      ))}

      <div style={styles.profile}>
        <div style={styles.avatar}>A</div>
        <div>
          <b>Amol</b>
          <p style={styles.role}>Admin</p>
        </div>
      </div>
    </aside>
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

function Panel({ title, sub, children }) {
  return (
    <motion.div
      style={styles.panel}
      whileHover={{
        scale: 1.02,
        y: -6,
        boxShadow: "0 30px 70px rgba(99,102,241,.45)",
      }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={styles.panelTitle}>{title}</h2>
      <p style={styles.panelSub}>{sub}</p>
      <div style={styles.chartBox}>{children}</div>
    </motion.div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    color: "#f8fafc",
    fontFamily: "Poppins, Arial, sans-serif",
    background:
      "radial-gradient(circle at 18% 20%, rgba(99,102,241,.45), transparent 35%), radial-gradient(circle at 85% 80%, rgba(20,184,166,.35), transparent 35%), #020617",
  },

  sidebar: {
    width: "235px",
    padding: "26px 18px",
    background: "rgba(2,6,23,.82)",
    borderRight: "1px solid rgba(255,255,255,.12)",
    backdropFilter: "blur(22px)",
    flexShrink: 0,
  },

  logo: {
    fontSize: "23px",
    marginBottom: "32px",
    background: "linear-gradient(90deg,#5eead4,#818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "900",
  },

  active: {
    padding: "14px 17px",
    borderRadius: "17px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    fontWeight: "900",
    marginBottom: "10px",
    color: "#ffffff",
    cursor: "pointer",
  },

  menu: {
    padding: "14px 17px",
    color: "#dbeafe",
    fontWeight: "800",
    marginBottom: "8px",
    borderRadius: "16px",
    cursor: "pointer",
  },

  profile: {
    marginTop: "48px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "15px",
    borderRadius: "20px",
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.14)",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    fontWeight: "900",
  },

  role: {
    margin: "3px 0 0",
    color: "#cbd5e1",
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
    boxShadow: "0 0 30px rgba(99,102,241,.18), 0 15px 35px rgba(0,0,0,.3)",
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

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "16px",
  },

  panel: {
    padding: "20px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 0 30px rgba(99,102,241,.25), 0 18px 42px rgba(0,0,0,.32)",
    minHeight: "300px",
    backdropFilter: "blur(22px)",
  },

  panelTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#ffffff",
    fontWeight: "900",
  },

  panelSub: {
    margin: "6px 0 12px",
    color: "#cbd5e1",
    fontWeight: "700",
  },

  chartBox: {
    height: "275px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  donutWrap: {
    position: "relative",
    width: "270px",
    height: "270px",
    display: "grid",
    placeItems: "center",
  },

  centerText: {
    position: "absolute",
    textAlign: "center",
    pointerEvents: "none",
    color: "#5eead4",
    fontWeight: "900",
    textShadow: "0 0 18px rgba(94,234,212,.6)",
  },

  centerPercent: {
    margin: 0,
    fontSize: "26px",
    color: "#5eead4",
  },

  centerLabel: {
    margin: "2px 0 0",
    color: "#ffffff",
    fontWeight: "900",
  },

  performance: {
    padding: "20px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 0 30px rgba(99,102,241,.25), 0 18px 42px rgba(0,0,0,.32)",
    minHeight: "300px",
    backdropFilter: "blur(22px)",
  },

  performanceTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
  },

  bigRate: {
    margin: 0,
    fontSize: "42px",
    color: "#5eead4",
    fontWeight: "900",
  },

  progressBg: {
    marginTop: "18px",
    height: "12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.15)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#22c55e,#5eead4,#818cf8)",
  },

  activityBox: {
    marginTop: "18px",
  },

  activity: {
    color: "#e2e8f0",
    fontWeight: "800",
    margin: "10px 0",
  },
};

export default Analytics;