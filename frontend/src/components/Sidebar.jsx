import { NavLink } from "react-router-dom";

function Sidebar() {
  const items = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Team", path: "/team" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>TaskFlow Pro</h2>

      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => (isActive ? styles.active : styles.menu)}
        >
          {item.name}
        </NavLink>
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

const styles = {
  sidebar: {
    width: "235px",
    padding: "26px 18px",
    background: "rgba(2,6,23,.82)",
    borderRight: "1px solid rgba(255,255,255,.12)",
    backdropFilter: "blur(22px)",
    flexShrink: 0,
    minHeight: "100vh",
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
    display: "block",
    textDecoration: "none",
    padding: "14px 17px",
    borderRadius: "17px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    fontWeight: "900",
    marginBottom: "10px",
    color: "#ffffff",
  },
  menu: {
    display: "block",
    textDecoration: "none",
    padding: "14px 17px",
    color: "#dbeafe",
    fontWeight: "800",
    marginBottom: "8px",
    borderRadius: "16px",
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
};

export default Sidebar;