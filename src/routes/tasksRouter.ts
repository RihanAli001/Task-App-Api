import express from "express";
import { validate } from "express-validation";
import {
  createTaskSchema,
  removeTasksSchema,
  updateTasksSchema,
} from "../utils/joi-validation";
import authenticate from "../middlewares/auth";
import {
  allTasks,
  createTask,
  removeTask,
  updateTask,
} from "../controllers/taskController";

const tasksRoute = express.Router();

tasksRoute.use(authenticate);

tasksRoute.get("/", allTasks);
tasksRoute.post("/", validate(createTaskSchema), createTask);
tasksRoute.put("/", validate(updateTasksSchema), updateTask);
tasksRoute.delete("/", validate(removeTasksSchema), removeTask);

export { tasksRoute };
