import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { pool } from "../database/config/connection";
import { createToken } from "../utils/token";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = <User>req.body;
  try {
    const conditionSql: string = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const conditionResult = await pool.query(conditionSql, [username, email]);
    if (conditionResult.rows?.length > 0) {
      res
        .status(200)
        .send({ msg: "Username or email already exist", data: null });
      return;
    }
    const sql: string = `INSERT INTO users(username, password, email) VALUES ($1,$2,$3) returning *`;
    const result = await pool.query(sql, [username, password, email]);
    res.status(200).send({ msg: "User has been register", data: result.rows });
  } catch (err) {
    next(err);
  }
};

const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sql: string = `SELECT * FROM users`;
    const result = await pool.query(sql);
    res
      .status(200)
      .send({ msg: "Get all registered users", data: result.rows });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <User>req.body;
  try {
    const sql: string = `SELECT * FROM users WHERE email=$1 AND password=$2`;
    const result = await pool.query(sql, [email, password]);
    if (result.rows.length > 0) {
      const token = createToken(result.rows[0].user_id);
      res.status(200).json({ msg: "Login successfully", data: { token } });
      return;
    }
    res.status(200).json({ msg: "Invalid user and password" });
  } catch (err) {
    next(err);
  }
};

export { register, allUsers, login };
