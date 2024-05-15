import { Joi } from "express-validation";

export const regSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const createTaskSchema = {
  body: Joi.object({
    taskDescription: Joi.string().required(),
  }),
};

export const updateTaskSchema = {
  body: Joi.object({
    id: Joi.number().required(),
    taskDescription: Joi.string().required(),
    taskComplete: Joi.boolean().required(),
  }),
};
