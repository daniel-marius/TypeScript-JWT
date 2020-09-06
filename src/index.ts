const PORT: number = Number(process.env.PORT) || 7000;

import "reflect-metadata";
import express, { Application } from "express";
import { json } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

import authRoutes from "./routes/auth";
import dbConnection from "./database/dbConn";

// import { errorHandler } from "./middlewares/http/error.middleware";
// import { notFoundHandler } from "./middlewares/http/notFound.middleware";

dotenv.config({ path: "./utils/config.env" });

dbConnection();

// Options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: `http://localhost:${PORT}`,
  preflightContinue: false,
};

const app: Application = express();

// Middlewares
// Helmet can help protect your app from some well-known web vulnerabilities
// by setting HTTP headers appropriately
app.use(helmet());
// Enables CORS with various options
app.use(cors(options));
app.use(morgan("dev"));
// This is a way to deal with DOS attacks, by adding a limit to the body payload
app.use(json({ limit: '1024kb' }));
// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

// Routes
app.use("/api", authRoutes);

// Http custom errors
// app.use(errorHandler);
// app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
