import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

dotenv.config();

const app = express();
app.get("/test", (req, res) => {
  res.send("TEST WORKING 🔥");
});

app.get("/api/auth/test", (req, res) => {
  res.send("AUTH WORKING 🔥");
});

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "*"
      
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

/* ================= AUTH MIDDLEWARE ================= */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token failed",
    });
  }
};

/* ================= ADMIN MIDDLEWARE ================= */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

/* ================= ROOT ================= */
app.get("/test", (req, res) => {
  res.send("Test route working ✅");
});

/* ================= AUTH TEST ================= */
app.get("/api/auth/test", (req, res) => {
  res.send("Auth API working ✅");
});

/* ================= REGISTER ================= */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "developer",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= LOGIN ================= */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= CREATE PROJECT ================= */
app.post("/api/projects", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, deadline, status, teamMembers } = req.body;

    if (!name || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Name, description and deadline are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      deadline,
      status: status || "planning",
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= GET PROJECTS ================= */
app.get("/api/projects", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("teamMembers", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= CREATE TASK ================= */
app.post("/api/tasks", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      deadline,
      status,
      assignedTo,
      project,
    } = req.body;

    if (!title || !project || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, project and deadline are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      deadline,
      status: status || "todo",
      assignedTo,
      project,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= GET TASKS ================= */
app.get("/api/tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= UPDATE TASK ================= */
app.put("/api/tasks/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= DASHBOARD ================= */
app.get("/api/dashboard", protect, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({ status: "done" });
    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });
    const todoTasks = await Task.countDocuments({ status: "todo" });

    const highPriority = await Task.countDocuments({ priority: "high" });
    const mediumPriority = await Task.countDocuments({ priority: "medium" });
    const lowPriority = await Task.countDocuments({ priority: "low" });

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("project", "name")
      .populate("assignedTo", "name email role");

    res.json({
      success: true,
      totalProjects,
      totalTasks,
      completedTasks,
      dashboard: {
        overview: {
          totalProjects,
          totalTasks,
          completedTasks,
          completionRate,
        },
        statusDistribution: {
          todo: todoTasks,
          inProgress: inProgressTasks,
          done: completedTasks,
        },
        priorityDistribution: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
        recentTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= DB CONNECT ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5002;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
    });
  })
  .catch((err) => console.log(err));