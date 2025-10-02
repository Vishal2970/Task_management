import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ConnectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
ConnectDB();



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));