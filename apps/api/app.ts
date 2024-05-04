import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUI from "swagger-ui-express";
import UserRouter from "./routers/userRouter";
import WorkspaceRouter from "./routers/workspaceRouter";
import swaggerSpec from "./docs/swagger";

const app: Application = express();
dotenv.config();

app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api/", UserRouter);
app.use("/api/", WorkspaceRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default app;
