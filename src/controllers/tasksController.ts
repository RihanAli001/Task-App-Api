import { Request, Response } from "express";
import { pool } from "../database/config/connection";
import { Task } from "../models/task.model";

const allTasks = async (req: Request, res: Response) => {
  console.log("Get todos");
  try {
    const completed = req.query.completed?.toString();
    const userId: number = req.userId;
    let sql: string = `SELECT task_id, task_description, task_complete FROM tasks WHERE user_id = $1 AND archive_at IS NULL`;
    const params: (number | string | boolean)[] = [userId];

    if (completed != undefined) {
      sql += ` AND task_complete = $2::BOOLEAN`;
      params.push(completed);
    }
    let result = await pool.query(sql, params);

    res
      .status(200)
      .json({ msg: "Tasks retrieved successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTasks = async (req: Request, res: Response) => {
  console.log("Add todo");
  try {
    const tasks: Task[] = req.body.tasks as Task[];
    const userId: number = req.userId;
    const attributesCount = 3;
    const placeholders = tasks
      .map(
        (_, index) =>
          `($${attributesCount * index + 1}::INTEGER,
          $${attributesCount * index + 2}::TEXT,
        $${attributesCount * index + 3}::BOOLEAN)`
      )
      .join(",");
    const sql = `INSERT INTO tasks(user_id, task_description, task_complete) VALUES ${placeholders} RETURNING task_id, task_description, task_complete;`;

    const values = tasks.flatMap((task) => [
      userId,
      task.taskDescription,
      task.taskComplete,
    ]);

    const result = await pool.query(sql, values);
    res
      .status(200)
      .json({ msg: "Task created successfully", data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTasks = async (req: Request, res: Response) => {
  console.log("Update todo");
  try {
    const tasks: Task[] = req.body.tasks as Task[];

    const placeholders = tasks
      .map(
        (_, index) =>
          `($${index * 3 + 1}::TEXT,
            $${index * 3 + 2}::BOOLEAN,
            $${index * 3 + 3}::INTEGER)`
      )
      .join(",");
    const values = tasks.flatMap((task) => [
      task?.taskDescription,
      task?.taskComplete,
      task?.id,
    ]);

    const sql = `UPDATE tasks AS t
                SET task_description = CASE WHEN u.task_description::TEXT IS NOT NULL THEN u.task_description::TEXT ELSE t.task_description END,
                    task_complete = CASE WHEN u.task_complete::BOOLEAN IS NOT NULL THEN u.task_complete::BOOLEAN ELSE t.task_complete END
                FROM (VALUES ${placeholders}) AS u(task_description, task_complete, task_id)
                WHERE t.task_id = u.task_id
                RETURNING t.task_id, t.task_description, t.task_complete`;

    const result = await pool.query(sql, values);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Tasks updated successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task updated", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error", errorMsg: error });
  }
};

const removeTasks = async (req: Request, res: Response) => {
  console.log("Delete todo");
  try {
    const taskIds = req.body.ids as number[];
    const currentDateAndTime = new Date();
    const placeholders = taskIds.map((_, index) => `$${index + 2}`).join(", ");
    const sql = `UPDATE tasks 
        SET archive_at = $1 
        WHERE task_id IN (${placeholders}) 
        AND archive_at IS NULL 
        RETURNING task_id, task_description, task_complete`;
    const result = await pool.query(sql, [currentDateAndTime, ...taskIds]);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Tasks removed successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task remove", data: result.rows });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { allTasks, createTasks, updateTasks, removeTasks };
