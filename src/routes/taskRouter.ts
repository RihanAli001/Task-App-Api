import express from "express";
import {
  allTasks,
  createTask,
  removeTask,
  updateTask,
} from "../controllers/taskController";
import { validate } from "express-validation";
import { createTaskSchema, updateTaskSchema } from "../utils/joi-validation";
import authenticate from "../middlewares/auth";

const taskRoute = express.Router();

taskRoute.use(authenticate);

taskRoute.get("/:id", allTasks);
taskRoute.post("/", validate(createTaskSchema), createTask);
taskRoute.put("/", validate(updateTaskSchema), updateTask);
taskRoute.delete("/:id", removeTask);

export { taskRoute };
