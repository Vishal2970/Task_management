import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
  currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
