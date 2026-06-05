import express from 'express';
import { createTask, getTasks,updateTask, deleteTask, toggleTaskStatus } from '../controllers/task.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(protect);
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskStatus);

export default router;