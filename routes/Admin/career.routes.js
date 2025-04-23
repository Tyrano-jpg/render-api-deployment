import express from "express";
import authMiddleware from "../../middleware/adminAuth.js";
import {
  AddUser,
  ChangePassword,
  GetUsers,
  UpdateUser,
} from "../../controllers/Admin/user.js";
import { GetAllCandidateList } from "../../controllers/Admin/career.js";

const router = express.Router();

// router.post("/add", authMiddleware, AddUser);
// router.post("/add", AddUser);
// router.patch("/edit/:id", authMiddleware, UpdateUser);
// router.patch("/edit/:id",UpdateUser);
// router.patch("/change-password", authMiddleware, ChangePassword);
// router.get("/list", authMiddleware, GetAllCandidateList);
router.get("/list", GetAllCandidateList);

export default router;
