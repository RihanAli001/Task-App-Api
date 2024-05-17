import express from "express";
import {
  createTask,
  deleteTask,
  taskById,
  updateTask,
} from "../controllers/taskController";
import { validate } from "express-validation";
import { createTaskSchema, updateTaskSchema } from "../utils/joi-validation";
import authenticate from "../middlewares/auth";

const taskRoute = express.Router();

taskRoute.use(authenticate);

taskRoute.get("/:id", taskById);
taskRoute.post("/", validate(createTaskSchema), createTask);
taskRoute.put("/:id", validate(updateTaskSchema), updateTask);
taskRoute.delete("/:id", deleteTask);

export { taskRoute };
