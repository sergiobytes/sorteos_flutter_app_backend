import { Router } from "express";
import {
  exportZip,
  purgeDatabase,
  markAsPaid,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/admin/export", requireAdmin, exportZip);
router.post("/admin/purge", requireAdmin, purgeDatabase);
router.put("/admin/mark-paid", requireAdmin, markAsPaid);

export default router;
