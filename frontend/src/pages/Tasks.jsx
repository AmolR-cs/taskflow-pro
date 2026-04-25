import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [toast, setToast] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [project, setProject] = useState("");

  const API ="https://taskflow-pro-backend-9xaa.onrender.com";
  const getToken = () => localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.log("Projects error:", err.response?.data || err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("Tasks error:", err.response?.data || err.message);
    }
  };

  const createTask = async () => {
    if (!title || !project || !deadline) {
      showToast("Please fill title, project and deadline ❌", "error");
      return;
    }

    try {
      await axios.post(
        `${API}/api/tasks`,
        { title, description, priority, deadline, status: "todo", project },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showToast("Task created successfully ✅");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");
      setProject("");
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || "Task creation failed ❌", "error");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${API}/api/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      showToast("Task status updated ✅");
      fetchTasks();
    } catch (err) {
      showToast("Status update failed ❌", "error");
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();

    const timer = setInterval(fetchTasks, 5000);
    return () => clearInterval(timer);
  }, []);

  const todo = tasks.filter((t) => t.status === "todo");
  const progress = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div style={styles.page}>
      <Sidebar active="Tasks" />

      {toast && (
        <motion.div
          style={{
            ...styles.toast,
            background:
              toast.type === "error"
                ? "linear-gradient(135deg,#ef4444,#f97316)"
                : "linear-gradient(135deg,#22c55e,#14b8a6)",
          }}
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {toast.msg}
        </motion.div>
      )}

      <main style={styles.main}>
        <motion.div style={styles.header} initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p style={styles.live}>● Live Task Board</p>
            <p style={styles.tag}>Task Management</p>
            <h1 style={styles.title}>Tasks Board</h1>
            <p style={styles.subtitle}>
              Create tasks, link projects, and update progress with live board sync.
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

        <motion.div style={styles.form} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
          <input style={styles.input} placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <input
            style={styles.input}
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select style={styles.input} value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select style={styles.input} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input style={styles.input} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

          <motion.button style={styles.createBtn} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }} onClick={createTask}>
            + Add Task
          </motion.button>
        </motion.div>

        <section style={styles.summaryRow}>
          <Summary title="Total Tasks" value={tasks.length} />
          <Summary title="Todo" value={todo.length} />
          <Summary title="In Progress" value={progress.length} />
          <Summary title="Completed" value={done.length} />
        </section>

        <section style={styles.board}>
          <Column title="Todo" tasks={todo} color="#38bdf8" updateStatus={updateStatus} />
          <Column title="In Progress" tasks={progress} color="#f59e0b" updateStatus={updateStatus} />
          <Column title="Done" tasks={done} color="#22c55e" updateStatus={updateStatus} />
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
        <div key={item} style={active === item ? styles.active : styles.menu} onClick={() => (window.location.href = `/${item.toLowerCase()}`)}>
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

function Column({ title, tasks, color, updateStatus }) {
  return (
    <motion.div style={styles.column} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ ...styles.columnTitle, color }}>{title}</h2>

      {tasks.length === 0 ? (
        <p style={styles.empty}>No tasks</p>
      ) : (
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task._id}
              style={styles.taskCard}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 200, damping: 22 }}
              whileHover={{ scale: 1.035, y: -5, boxShadow: "0 28px 75px rgba(56,189,248,.45)" }}
            >
              <div style={styles.taskTop}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <span style={priorityStyle(task.priority)}>{task.priority}</span>
              </div>

              <p style={styles.desc}>{task.description || "No description added"}</p>

              <div style={styles.info}>
                <span>Project</span>
                <b>{task.project?.name || "Project"}</b>
              </div>

              <div style={styles.info}>
                <span>Deadline</span>
                <b>{task.deadline?.slice(0, 10) || "Not set"}</b>
              </div>

              <div style={styles.statusBtns}>
                <button style={styles.todoBtn} onClick={() => updateStatus(task._id, "todo")}>Todo</button>
                <button style={styles.progressBtn} onClick={() => updateStatus(task._id, "in-progress")}>Progress</button>
                <button style={styles.doneBtn} onClick={() => updateStatus(task._id, "done")}>Done</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function Summary({ title, value }) {
  return (
    <motion.div style={styles.summary} whileHover={{ scale: 1.025, y: -3 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <p style={styles.summaryTitle}>{title}</p>
      <h2 style={styles.summaryValue}>{value}</h2>
    </motion.div>
  );
}

const priorityStyle = (priority) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "900",
  textTransform: "capitalize",
  color: "#fff",
  background:
    priority === "high"
      ? "rgba(239,68,68,.9)"
      : priority === "medium"
      ? "rgba(245,158,11,.9)"
      : "rgba(34,197,94,.9)",
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
    color: "#ffffff",
    fontWeight: "900",
    boxShadow: "0 18px 45px rgba(20,184,166,.45)",
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

  role: { margin: "3px 0 0", color: "#cbd5e1" },

  main: { flex: 1, padding: "22px 24px", overflowY: "auto" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  live: { color: "#22c55e", fontWeight: "900", margin: 0, fontSize: "13px" },

  tag: { color: "#5eead4", fontWeight: "900", margin: "4px 0 0", fontSize: "14px" },

  title: {
    fontSize: "38px",
    margin: "3px 0",
    fontWeight: "900",
    lineHeight: "1.05",
    background: "linear-gradient(90deg,#ffffff,#5eead4,#818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: { color: "#e2e8f0", fontWeight: "700", margin: 0, fontSize: "14px" },

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
    background: "linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.06))",
    border: "1px solid rgba(255,255,255,.16)",
    boxShadow: "0 15px 35px rgba(0,0,0,.3)",
    color: "#f8fafc",
  },

  summaryTitle: { margin: 0, color: "#dbeafe", fontWeight: "800", fontSize: "14px" },
  summaryValue: { margin: "6px 0 0", color: "#ffffff", fontSize: "28px" },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },

  column: {
    padding: "16px",
    borderRadius: "24px",
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.15)",
    minHeight: "360px",
    backdropFilter: "blur(20px)",
  },

  columnTitle: { marginTop: 0, fontSize: "22px", fontWeight: "900" },

  taskCard: {
    padding: "16px",
    borderRadius: "18px",
    background: "linear-gradient(145deg,rgba(30,41,59,0.94),rgba(15,23,42,0.94))",
    border: "1px solid rgba(255,255,255,.12)",
    marginBottom: "12px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },

  taskTop: { display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" },
  taskTitle: { margin: 0, color: "#ffffff", fontSize: "17px" },
  desc: { color: "#e5e7eb", lineHeight: "1.45", fontWeight: "650", fontSize: "13px" },

  info: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "9px",
    color: "#cbd5e1",
    fontSize: "12px",
    gap: "10px",
  },

  statusBtns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "8px",
    marginTop: "13px",
  },

  todoBtn: { padding: "8px", border: "none", borderRadius: "10px", background: "rgba(56,189,248,.85)", color: "#fff", fontWeight: "800", cursor: "pointer" },
  progressBtn: { padding: "8px", border: "none", borderRadius: "10px", background: "rgba(245,158,11,.9)", color: "#fff", fontWeight: "800", cursor: "pointer" },
  doneBtn: { padding: "8px", border: "none", borderRadius: "10px", background: "rgba(34,197,94,.9)", color: "#fff", fontWeight: "800", cursor: "pointer" },

  empty: {
    color: "#94a3b8",
    fontWeight: "800",
    textAlign: "center",
    marginTop: "35px",
  },
};

export default Tasks;