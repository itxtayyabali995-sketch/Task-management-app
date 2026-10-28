import express from "express";
import { createTask, deleteTask, getAllTasks, toggleFavorite, updateTask } from "../controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/add", isAuthenticated, createTask); 
router.get("/get", isAuthenticated, getAllTasks);
router.put("/update/:id", isAuthenticated, updateTask);
router.delete("/delete/:id", isAuthenticated, deleteTask);
router.put("/favorite/:id", isAuthenticated, toggleFavorite);

export default router;