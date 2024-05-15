import express from "express";
import {
  createTask,
  deleteTask,
  tasks,
  updateTask,
} from "../controllers/taskController";
import { validate } from "express-validation";
import { createTaskSchema, updateTaskSchema } from "../utils/joi-validation";
import authenticate from "../middlewares/auth";

const taskRoute = express.Router();

taskRoute.use(authenticate)

taskRoute.use("/add", validate(createTaskSchema), createTask);
taskRoute.use("/update", validate(updateTaskSchema), updateTask);
taskRoute.use("/delete/:id", deleteTask);
taskRoute.use("/", tasks);

export { taskRoute };
