import { buildUploadSignature } from "../services/cloudinary.service.js";

export async function signUpload(_req, res) {
  try {
    const payload = await buildUploadSignature();
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "signing_failed" });
  }
}
