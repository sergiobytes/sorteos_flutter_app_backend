import {
  insertParticipant,
  getParticipantsMasked,
} from "../services/participants.service.js";

export async function createParticipant(req, res) {
  const { name, walletNumber, phone, photoPublicId, photoVersion } =
    req.body || {};
  if (!name || !walletNumber || !phone || !photoPublicId) {
    return res.status(400).json({ error: "missing_fields" });
  }
  try {
    const row = await insertParticipant({
      name,
      walletNumber,
      phone,
      photoPublicId,
      photoVersion,
    });
    res.status(201).json(row);
  } catch (e) {
    if (e.code === "23505")
      return res.status(409).json({ error: "phone_already_registered" });
    console.error(e);
    res.status(500).json({ error: "db_insert_failed" });
  }
}

export async function listMasked(_req, res) {
  try {
    const rows = await getParticipantsMasked();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_query_failed" });
  }
}
