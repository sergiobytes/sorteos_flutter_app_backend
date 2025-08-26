import { Router } from "express";
import { exportZip, purgeDatabase } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/admin/export", requireAdmin, exportZip);
router.post("admin/purge", requireAdmin, purgeDatabase);

export default router;
