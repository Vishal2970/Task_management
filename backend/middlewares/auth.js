import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id, isAdmin: user.isAdmin, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access required" });
  next();
};
