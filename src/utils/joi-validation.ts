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

export const createTasksSchema = {
  body: Joi.object({
    tasks: Joi.array()
      .items(
        Joi.object({
          taskDescription: Joi.string().required(),
          taskComplete: Joi.boolean().required(),
        })
      )
      .required(),
  }),
};

export const updateTaskSchema = {
  body: Joi.object({
    taskDescription: Joi.string(),
    taskComplete: Joi.boolean(),
  }).or("taskDescription", "taskComplete"),
};

export const updateTasksSchema = {
  body: Joi.object({
    tasks: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          taskDescription: Joi.string(),
          taskComplete: Joi.boolean(),
        }).or("taskDescription", "taskComplete")
      )
      .min(1)
      .required(),
  }),
};

export const removeTasksSchema = {
  body: Joi.object({
    ids: Joi.array().items(Joi.number()).min(1).required(),
  }),
};
