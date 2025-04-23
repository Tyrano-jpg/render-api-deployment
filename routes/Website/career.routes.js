import express from "express";
import authMiddleware from "../../middleware/adminAuth.js";
import {
  AddUser,
  ChangePassword,
  GetUsers,
  UpdateUser,
} from "../../controllers/Admin/user.js";
import { GetAllCandidateList } from "../../controllers/Admin/career.js";
import { AddJobApplication } from "../../controllers/Website/career.js";
import { MulterFunction } from "../../Utils/MulterFunction.js";

const router = express.Router();

// router.post("/add", authMiddleware, AddUser);
// router.post("/add", AddUser);
// router.patch("/edit/:id", authMiddleware, UpdateUser);
// router.patch("/edit/:id",UpdateUser);
// router.patch("/change-password", authMiddleware, ChangePassword);

router.post("/add-job-application", MulterFunction(`public/upload/pdf`).fields([
  { name: 'resume_file' },
]), AddJobApplication);

export default router;
