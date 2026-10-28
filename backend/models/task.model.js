import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    dueTime: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Work", "Personal", "Learning", "Favorite"],
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done", "pending", "completed"],
        default: "To Do"
    },
    progress: {
        type: String,
        default: "0%"
    },
    description: {
        type: String,
        default: ""
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);