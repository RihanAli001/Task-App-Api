import { NextFunction, Request, Response } from "express";
import { pool } from "../database/config/connection";
import { Task } from "../models/task.model";

const allTasks = async (req: Request, res: Response,next: NextFunction) => {
  console.log("Get todos");
  try {
    const { id } = req.params;
    if (id !== undefined && Number.isNaN(+id)) {
      res.status(400).json({ msg: "Invalid Task Id", data: null });
      return;
    }
    const completed: string | undefined = req.query.completed?.toString();
    const userId: number = req.userId;

    let sql: string = `SELECT task_id, task_description, task_complete FROM tasks WHERE user_id = ${userId} AND archive_at IS NULL ${ id ? ` AND task_id = ${id}` : "" } ${completed ? ` AND task_complete = ${completed}::BOOLEAN` : ""}`;

    let result = await pool.query(sql);

    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Tasks retrieved successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task found", data: result.rows });
    }
  } catch (error) {
    next(error);
  }
};

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Add todo");
  try {
    const tasks: Task[] = req.body.tasks;
    const userId: number = +req.userId;

    const placeholders: string = tasks
      .map(
        (task) =>
          `(${userId}::INTEGER,
          '${task.taskDescription}'::TEXT,
        ${task.taskComplete}::BOOLEAN)`
      )
      .join(",");

    const sql: string = `INSERT INTO tasks(user_id, task_description, task_complete) VALUES ${placeholders} RETURNING task_id, task_description, task_complete;`;


    const result = await pool.query(sql);
    if(result.rowCount) {
      res
        .status(200)
        .json({ msg: "Task created successfully", data: result.rows });
    } else {
      res
        .status(400)
        .json({ msg: "Task does not created", data: result.rows });

    }
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req: Request, res: Response,next: NextFunction) => {
  console.log("Update todo");
  try {
    const tasks: Task[] = req.body?.id ? [req.body] : req.body.tasks;
    const placeholders = tasks
      .map((task: Task) => {
        return `(${task?.taskDescription ? `'${task?.taskDescription}'` : null},
            ${task?.taskComplete ?? null},
            ${task?.id})`;
      })
      .join(",");

    const sql = `UPDATE tasks AS t SET task_description = CASE WHEN u.task_description IS NOT NULL THEN u task_description::TEXT ELSE t.task_description END, task_complete = CASE WHEN u.task_complete::BOOLEAN IS NOT NULL THEN u.task_complete::BOOLEAN ELSE t.task_complete END FROM (VALUES ${placeholders}) AS u(task_description, task_complete, task_id) WHERE t.task_id = u.task_id AND archive_at IS NULL RETURNING t.task_id, t.task_description, t.task_complete`;

    const result = await pool.query(sql);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Tasks updated successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task updated", data: result.rows });
    }
  } catch (error) {
    next(error);
  }
};

const removeTask = async (req: Request, res: Response,next: NextFunction) => {
  console.log("Remove todo");
  try {
    if ( Number.isNaN(+req.params?.id) && !req.body?.ids ) {
      res.status(400).json({ msg: "Invalid task id", data: null });
      return;
    }
    const taskIds = req?.params?.id
      ? [req.params?.id]
      : (req.body?.ids as number[]);

    const sql = `UPDATE tasks SET archive_at = $1 WHERE task_id IN (${taskIds.join(',')}) AND archive_at IS NULL RETURNING task_id, task_description, task_complete`;

    const result = await pool.query(sql, [new Date()]);
    if (result.rowCount) {
      res
        .status(200)
        .json({ msg: "Tasks removed successfully", data: result.rows });
    } else {
      res.status(200).json({ msg: "No task remove", data: result.rows });
    }
  } catch (error) {
    next(error);
  }
};

export { allTasks, createTask, updateTask, removeTask };
