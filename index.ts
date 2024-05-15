
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { userRoute } from "./src/routes/userRouter";
import { taskRoute } from "./src/routes/taskRouter";

declare global {
    namespace Express {
      interface Request {
        userId: number
      }
    }
  }

const app = express();
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/task", taskRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (res.statusCode && res.statusCode !== 500) {
    res.status(res.statusCode).send(err);
    return;
  }
  res.status(500).json({
    message: "internal server error",
    error: err.message,
  });
});

app.listen(8000, () => {
  console.log("App is listening to the port 8000...");
});
