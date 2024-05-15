import express from "express";
import { login, register } from "../controllers/userController";
import { validate } from "express-validation";
import { loginSchema, regSchema } from "../utils/joi-validation";

const userRoute = express.Router();

userRoute.use("/register", validate(regSchema), register);
userRoute.use("/login", validate(loginSchema), login);

export { userRoute };
