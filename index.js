import { config } from "dotenv";
config();
import express from "express";

import mongo_service from "./database/mongo.service.js";
mongo_service();
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 2000;

//  Admin Routes imports
import authRouter from "./routes/Admin/auth.routes.js";
import usersRouter from "./routes/Admin/user.routes.js";
import careerRouter from "./routes/Admin/career.routes.js"

// Website routes import
import websiteCareerRouter from "./routes/Website/career.routes.js"

import { fileURLToPath } from "url";
import { dirname } from "path";

import { globalErrorHandler } from "./Utils/GlobalErrorHandler.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
var corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://bcbaadmin.kdcstaging.in",
    "http://localhost:3000",
    "http://192.168.1.39:3001",
    "http://192.168.1.39:3000",
    "http://localhost:5173"
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("./public/upload"));
app.use(express.static(__dirname));
app.use(cookieParser());


// app.group("/api/v1/admin", (router) => {
  app.use("/api/v1/admin/auth", authRouter);
  app.use("/api/v1/admin/user", usersRouter);
  app.use("/api/v1/admin/career", careerRouter);
// });

// app.group("/api/v1/website", (router) => {
  app.use("/api/v1/website/career", websiteCareerRouter);
// });


app.use(globalErrorHandler);

// Error handling for the server

app.listen(PORT, () => {
  console.log(`Admin Panel Server listening on port ${PORT}`);
});
