import express from "express";
import {
  allTasks,
  createTasks,
  removeTasks,
  updateTasks,
} from "../controllers/tasksController";
import { validate } from "express-validation";
import {
  createTasksSchema,
  removeTasksSchema,
  updateTasksSchema,
} from "../utils/joi-validation";
import authenticate from "../middlewares/auth";

const tasksRoute = express.Router();

tasksRoute.use(authenticate);

tasksRoute.get("/", allTasks);
tasksRoute.post("/", validate(createTasksSchema), createTasks);
tasksRoute.put("/", validate(updateTasksSchema), updateTasks);
tasksRoute.delete("/", validate(removeTasksSchema), removeTasks);

export { tasksRoute };
