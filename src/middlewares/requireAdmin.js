import { adminApp } from "../config/firebase.js";

export async function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token) return res.status(401).send("unauthorized");

    const decoded = await adminApp.auth().verifyIdToken(token);

    if (decoded.uid !== undefined) return next();
    return res.status(403).send("forbidden");
  } catch {
    return res.status(401).send("unauthorized");
  }
}
