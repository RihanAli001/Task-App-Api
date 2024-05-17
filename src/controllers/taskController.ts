import { Request, Response } from "express";
import { pool } from "../database/config/connection";
import { Task } from "../models/task.model";

const taskById = async (req: Request, res: Response) => {
  console.log("Get todos");
  try {
    const { id } = req.params;
    const userId: number = req.userId;
    const sql: string = `SELECT task_id, task_description, task_complete FROM tasks WHERE user_id = $1 AND task_id = $2 AND archive_at IS NULL`;
    const result = await pool.query(sql, [userId, id]);

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
      res.send({ msg: "Description should not be empty" });
      return;
    }
    const userId: number = req.userId;
    const sql = `INSERT INTO tasks(user_id, task_description) VALUES ($1, $2) returning task_id, task_description, task_complete`;
    const result = await pool.query(sql, [userId, taskDescription]);
    res
      .status(200)
      .json({ msg: "Task created successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  console.log("Update todo");
  try {
    const id = +req.params.id;
    if (Number.isNaN(id)) {
      res.status(200).json({ msg: "Invalid task id", data: null });
      return;
    }
    const { taskDescription, taskComplete } = (<Task>req.body) as Task;

    const sql = `UPDATE tasks 
                  SET task_description = CASE WHEN $1::TEXT IS NOT NULL THEN $1::TEXT ELSE task_description END,
                  task_complete = CASE WHEN $2::BOOLEAN IS NOT NULL THEN $2::BOOLEAN ELSE task_complete END
                  WHERE task_id = $3
                  RETURNING task_id, task_description, task_complete`;

    const result = await pool.query(sql, [taskDescription, taskComplete, id]);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Task updated successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task updated", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error", errorMsg: error });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  console.log("Delete todo");
  try {
    const { id } = req.params;
    const currentDateAndTime = new Date();
    const sql = `UPDATE tasks SET archive_at = $1 WHERE task_id=$2 AND archive_at IS NULL returning task_id, task_description, task_complete`;
    const result = await pool.query(sql, [currentDateAndTime, id]);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Task removed successfully", data: result.rows });
    } else {
      res
        .status(200)
        .json({ msg: "No task found to remove", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { taskById, createTask, updateTask, deleteTask };
