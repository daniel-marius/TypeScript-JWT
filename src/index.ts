import "reflect-metadata";
import express, { Application } from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./routes/auth";
import dbConnection from "./database/dbConn";

dotenv.config({ path: "./utils/config.env" });

dbConnection();

const app: Application = express();

// Helmet can help protect your app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
app.use(helmet());

// middlewares
app.use(morgan("dev"));
app.use(json());

// routes
app.use("/api", authRoutes);

const PORT: number = Number(process.env.PORT) || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
