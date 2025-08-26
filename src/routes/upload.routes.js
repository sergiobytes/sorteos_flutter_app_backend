import { Router } from "express";
import { signUpload } from "../controllers/upload.controller.js";

const router = Router();
router.post("/sign-upload", signUpload);

export default router;
