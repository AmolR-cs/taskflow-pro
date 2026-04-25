import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Team() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);

  const API = "http://localhost:5002";
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
      console.log("Team page error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  const teamMembers = [
    {
      name: "Amol",
      role: "Admin",
      email: "amol@gmail.com",
      avatar: "A",
      status: "Online",
      work: "Project Owner",
      progress: 92,
    },
    {
      name: "Project Manager",
      role: "Manager",
      email: "manager@taskflow.com",
      avatar: "M",
      status: "Active",
      work: "Sprint Planning",
      progress: 84,
    },
    {
      name: "Frontend Developer",
      role: "Developer",
      email: "frontend@taskflow.com",
      avatar: "F",
      status: "Working",
      work: "React UI",
      progress: 78,
    },
    {
      name: "Backend Developer",
      role: "Developer",
      email: "backend@taskflow.com",
      avatar: "B",
      status: "Working",
      work: "API & MongoDB",
      progress: 88,
    },
  ];

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || m.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div style={styles.page}>
      <Sidebar active="Team" />

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              style={styles.modal}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalTop}>
                <div style={styles.bigAvatar}>{selectedMember.avatar}</div>
                <span style={getStatusStyle(selectedMember.status)}>
                  {selectedMember.status}
                </span>
              </div>

              <h2 style={styles.modalName}>{selectedMember.name}</h2>
              <p style={styles.memberRole}>{selectedMember.role}</p>

              <div style={styles.modalInfo}>
                <span>Email</span>
                <b>{selectedMember.email}</b>
              </div>

              <div style={styles.modalInfo}>
                <span>Current Work</span>
                <b>{selectedMember.work}</b>
              </div>

              <div style={styles.modalInfo}>
                <span>Productivity</span>
                <b>{selectedMember.progress}%</b>
              </div>

              <div style={styles.progressBg}>
                <motion.div
                  style={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedMember.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <button
                style={styles.closeBtn}
                onClick={() => setSelectedMember(null)}
              >
                Close Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={styles.main}>
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p style={styles.live}>● Team Workspace</p>
            <p style={styles.tag}>Team Management</p>
            <h1 style={styles.title}>Team Overview</h1>
            <p style={styles.subtitle}>
              Manage roles, responsibilities and productivity in one premium workspace.
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
          <Summary title="Team Members" value={teamMembers.length} />
          <Summary title="Projects" value={projects.length} />
          <Summary title="In Progress" value={inProgressTasks} />
          <Summary title="Completed Tasks" value={completedTasks} />
        </section>

        <motion.div
          style={styles.controls}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            style={styles.input}
            placeholder="Search team member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={styles.input}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Developer</option>
          </select>
        </motion.div>

        <section style={styles.grid}>
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.email}
              style={styles.card}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0 35px 90px rgba(99,102,241,0.45)",
              }}
            >
              <div style={styles.cardTop}>
                <div style={styles.bigAvatar}>{member.avatar}</div>
                <span style={getStatusStyle(member.status)}>
                  {member.status}
                </span>
              </div>

              <h2 style={styles.memberName}>{member.name}</h2>
              <p style={styles.memberRole}>{member.role}</p>

              <div style={styles.info}>
                <span>Email</span>
                <b>{member.email}</b>
              </div>

              <div style={styles.info}>
                <span>Current Work</span>
                <b>{member.work}</b>
              </div>

              <div style={styles.info}>
                <span>Productivity</span>
                <b>{member.progress}%</b>
              </div>

              <div style={styles.progressBg}>
                <motion.div
                  style={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${member.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              <button
                style={styles.viewBtn}
                onClick={() => setSelectedMember(member)}
              >
                View Profile
              </button>
            </motion.div>
          ))}
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

const getStatusStyle = (status) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "900",
  color: "#fff",
  background:
    status === "Online"
      ? "rgba(34,197,94,.85)"
      : status === "Active"
      ? "rgba(56,189,248,.85)"
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

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,.78)",
    backdropFilter: "blur(10px)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  modal: {
    width: "360px",
    maxWidth: "95%",
    padding: "24px",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg,rgba(30,41,59,.96),rgba(15,23,42,.96))",
    border: "1px solid rgba(255,255,255,.18)",
    boxShadow: "0 35px 90px rgba(99,102,241,.45)",
  },

  modalTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalName: {
    margin: "16px 0 3px",
    fontSize: "26px",
    color: "#ffffff",
    fontWeight: "900",
  },

  modalInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "14px",
    color: "#e2e8f0",
    fontSize: "13px",
    gap: "12px",
  },

  closeBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#22c55e,#14b8a6)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
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
    boxShadow: "0 15px 35px rgba(0,0,0,.3)",
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

  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    padding: "14px",
    borderRadius: "22px",
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.15)",
    marginBottom: "16px",
    backdropFilter: "blur(20px)",
  },

  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(15,23,42,.9)",
    color: "#f8fafc",
    outline: "none",
    fontWeight: "700",
    minWidth: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  card: {
    padding: "18px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 18px 42px rgba(0,0,0,.32)",
    minHeight: "270px",
    backdropFilter: "blur(22px)",
    color: "#f8fafc",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  bigAvatar: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#38bdf8,#8b5cf6)",
    color: "#ffffff",
    fontWeight: "900",
    fontSize: "24px",
    boxShadow: "0 18px 35px rgba(99,102,241,.35)",
  },

  memberName: {
    margin: "16px 0 3px",
    fontSize: "21px",
    color: "#ffffff",
    fontWeight: "900",
  },

  memberRole: {
    margin: 0,
    color: "#5eead4",
    fontWeight: "900",
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    color: "#e2e8f0",
    fontSize: "13px",
    gap: "12px",
  },

  progressBg: {
    marginTop: "16px",
    height: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.15)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#22c55e,#5eead4,#818cf8)",
  },

  viewBtn: {
    marginTop: "16px",
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },
};

export default Team;