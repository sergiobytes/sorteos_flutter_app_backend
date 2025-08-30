import { Router } from "express";
import {
  exportZip,
  purgeDatabase,
  markAsPaid,
  listUnpaid,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.get("/admin/export", requireAdmin, exportZip);
router.get("/admin/unpaid", requireAdmin, listUnpaid);
router.post("/admin/purge", requireAdmin, purgeDatabase);
router.put("/admin/mark-paid", requireAdmin, markAsPaid);

export default router;
