import { Router } from "express";
import {
  createParticipant,
  listMasked,
  validateWallet,
} from "../controllers/participants.controller.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.post("/participants", createParticipant);
router.get("/participants", requireAdmin, listMasked);
router.get("/wallet/validate", validateWallet);

export default router;
