import express from "express";
import {
  getTasks,
  getSingleTask,
  createTask,
  assignTask,
  markComplete,
  deleteTask
} from "../controllers/taskController.js";

import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);
router.get("/", getTasks);

router.get("/:id",getSingleTask);


router.post("/", requireAdmin, createTask);


router.put("/:id/assign", assignTask);



router.put("/:id/complete", markComplete);

router.delete("/:id", deleteTask);

export default router;
