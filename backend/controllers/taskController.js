import Task from "../models/Tasks.js";
import User from "../models/Users.js";


export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.isAdmin) {
      const tasks = await Task.find().populate("creator assignedTo currentOwner", "name email");
      return res.json(tasks);
    }
    const tasks = await Task.find({
      $or: [
        { creator: userId },
        { assignedTo: userId }
      ]
    }).populate("creator assignedTo currentOwner", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("creator", "name email")
      .populate("currentOwner", "name email")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const createTask = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Only admin can create tasks" });

    const { title, description } = req.body;
    const creatorId = req.user.id;

    const task = new Task({
      title,
      description,
      creator: creatorId,
      currentOwner: creatorId,
      assignedTo: null,
      status: "pending"
    });

    await task.save();
    const populated = await task.populate("creator", "name email").execPopulate?.() ?? await Task.findById(task._id).populate("creator", "name email");
    res.status(201).json({ message: "Task created", task: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { id } = req.params; // task id
    const { assigneeId } = req.body; 

    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creator.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Only creator or admin can assign the task" });
    }

    const assignee = await User.findById(assigneeId);
    if (!assignee) return res.status(404).json({ message: "Assignee user not found" });

    task.assignedTo = assignee._id;
    task.currentOwner = assignee._id;
    task.status = "in-progress";
    await task.save();

    const populated = await Task.findById(task._id).populate("creator assignedTo currentOwner", "name email");
    res.json({ message: "Task assigned", task: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id.toString();
    const { comment } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only currentOwner mark complete
    if (task.currentOwner.toString() !== userId) {
      return res.status(403).json({ message: "Only the current owner can mark the task complete" });
    }

    //add comment if provided
    if (comment && comment.trim() !== "") {
      task.comments.push({
        user: userId,
        text: comment.trim()
      });
    }

    task.status = "completed";
    // task.currentOwner = task.creator;
    task.assignedTo = null;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("creator assignedTo currentOwner comments.user", "name email");

    res.json({ message: "Task completed successfully ", task: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete task=>> only creator or admin
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creator.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Only creator or admin can delete the task" });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
