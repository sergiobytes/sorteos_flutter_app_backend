import { buildUploadSignature } from "../services/cloudinary.service.js";
import { isWalletAvailable } from "../services/participants.service.js";

export async function signUpload(_req, res) {
  try {
    const { walletNumber } = req.body || {};

    const check = await isWalletAvailable(walletNumber);
    if (!check.ok) {
      const status = check.reason === "already_taken" ? 409 : 400;
      return res.status(status).json(check);
    }

    const payload = await buildUploadSignature();
    res.json({ ...payload, wallet: check.wallet });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "signing_failed" });
  }
}
