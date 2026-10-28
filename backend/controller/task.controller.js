import { Task } from "../models/task.model.js";

// 1. Create Task
export const createTask = async (req, res) => {
    try {
        const { title, dueDate, dueTime, category, description, progress } = req.body;
        const userId = req.id; 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user", success: false });
        }

        const task = await Task.create({
            title,
            dueDate,
            dueTime,
            category,
            description,
            progress,
            user: userId 
        });

        return res.status(201).json({
            message: "Task created successfully",
            success: true,
            task
        });
    } catch (error) {
        console.error( error);
        return res.status(500).json({ message: "Task creation error.", success: false });
    }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};

// 3. Update Task (Edit)
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, dueDate, dueTime, category, status, progress, description, isFavorite } = req.body;

        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        if (title) task.title = title;
        if (dueDate) task.dueDate = dueDate;
        if (dueTime) task.dueTime = dueTime;
        if (category) task.category = category;
        if (status) task.status = status;
        if (progress !== undefined) task.progress = progress;
        if (description !== undefined) task.description = description;
        if (isFavorite !== undefined) task.isFavorite = isFavorite;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully.",
            task,
            success: true
        });
    } catch (error) {
        console.log("Update Error:", error);
        return res.status(500).json({
            message: "Server error while updating task",
            error: error.message,
            success: false
        });
    }
};

// 4. Delete Task
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error while deleting task",
            success: false
        });
    }
};

// 5. Toggle Favorite
export const toggleFavorite = async (req, res) => {
    try {
        const taskId = req.params.id;
        let task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found.",
                success: false
            });
        }

        task.isFavorite = !task.isFavorite;
        await task.save();

        return res.status(200).json({
            message: task.isFavorite ? "Added to favorites" : "Removed from favorites",
            task,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};