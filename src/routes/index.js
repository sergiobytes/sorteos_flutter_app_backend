import { Router } from "express";
import uploadRoutes from "./upload.routes.js";
import participantsRoutes from "./participants.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ ok: true, service: "sorteo-backend" })
);

router.use(uploadRoutes);
router.use(participantsRoutes);
router.use(adminRoutes);

export default router;
