import express from "express";
import { register, login ,getUsers} from "../controllers/authController.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/",authenticate,requireAdmin,getUsers);

export default router;
