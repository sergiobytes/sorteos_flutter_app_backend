import { pool } from "../config/db.js";
import {
  last4Of,
  phoneHasBuf,
  ensureEncyprionKey as ensureEncryptionKey,
} from "./crypto.service.js";

export async function insertParticipant({
  name,
  walletNumber,
  phone,
  photoPublicId,
  photoVersion,
}) {
  const key = ensureEncryptionKey();
  const last4 = last4Of(phone);
  const hash = phoneHasBuf(phone);

  const sql = `
    insert into participants 
        (name, wallet_number, photo_public_id, photo_version, 
        phone_enc, phone_last4, phone_hash, created_at) 
    values
        ($1, $2, $3, $4, 
        pgp_sym_encrypt($5, $6, 'cipher-algo=aes256, compress-algo=1'),
        $7, $8, NOW() AT TIME ZONE 'UTC')
    returning id, created_at
  `;

  const params = [
    name,
    walletNumber,
    photoPublicId,
    photoVersion || null,
    phone,
    key,
    last4,
    hash,
  ];

  const { rows } = await pool.query(sql, params);
  return rows[0];
}

export async function getParticipantsMasked() {
  const { rows } = await pool.query("select * from participants_masked");
  return rows;
}

export async function getAllForExport() {
  const key = ensureEncryptionKey();
  const sql = `
    SELECT
      name,
      wallet_number,
      pgp_sym_decrypt(phone_enc, $1)::text AS phone_full,
      phone_last4,
      photo_public_id,
      created_at,
      is_paid,
      paid_at,
      marked_by_email
    FROM participants
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(sql, [key]);
  return rows;
}

export async function getPublicIdsForPurge() {
  const sql = "SELECT photo_public_id FROM participants";
  const { rows } = await pool.query(sql);
  return rows.map((r) => r.photo_public_id);
}

export async function purgeParticipants() {
  const sql = "DELETE FROM participants";
  const { rowCount } = await pool.query(sql);
  return rowCount;
}

export async function markWalletAsPaid(participantId, adminEmail) {
  const sql = `
    UPDATE participants
    SET is_paid = true, paid_at = NOW() AT TIME ZONE 'UTC', marked_by_email = $1
    WHERE id = $2
  `;
  const params = [adminEmail, participantId];
  const { rowCount } = await pool.query(sql, params);
  return rowCount > 0;
}
