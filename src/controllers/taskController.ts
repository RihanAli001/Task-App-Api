import { Request, Response } from "express";
import { pool } from "../database/config/connection";
import { Task } from "../models/task.model";

const tasks = async (req: Request, res: Response) => {
  console.log("Get todos");
  try {
    const userId: number = req.userId;
    const sql: string = `SELECT * FROM tasks WHERE user_id = $1`;
    const result = await pool.query(sql, [userId]);
    res
      .status(200)
      .json({ msg: "Tasks retrieved successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTask = async (req: Request, res: Response) => {
  console.log("Add todo");
  try {
    const { taskDescription } = <Task>req.body;
    if (!taskDescription) {
      res.send({ msg: "Invalid description" });
      return;
    }
    const userId: number = req.userId;
    const sql = `INSERT INTO tasks(user_id, task_description) VALUES ($1, $2) returning *`;
    const result = await pool.query(sql, [userId, taskDescription]);
    res.status(200).json({ msg: "Task created", data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  console.log("Update todo");
  try {
    const { id, taskDescription, taskComplete } = <Task>req.body;
    const sql = `UPDATE tasks SET task_description=$1, task_complete=$2 WHERE task_id=$3 returning *`;
    const result = await pool.query(sql, [taskDescription, taskComplete, id]);
    if (result.rowCount) {
      res.status(200).json({ msg: "Task updated", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task updated", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  console.log("Delete todo");
  try {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE task_id=$1 returning *`;
    const result = await pool.query(sql, [id]);
    if (result.rowCount) {
      res.status(200).json({ msg: "Task deleted", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task deleted", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { tasks, createTask, updateTask, deleteTask };
