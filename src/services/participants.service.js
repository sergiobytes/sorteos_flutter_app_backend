import { pool } from "../config/db.js";
import { last4Of, phoneHasBuf, ensureEncyprionKey } from "./crypto.service.js";

export async function insertParticipant({
  name,
  walletNumber,
  phone,
  photoPublicId,
  photoVersion,
}) {
  const key = ensureEncyprionKey();
  const last4 = last4Of(phone);
  const hash = phoneHasBuf(phone);

  const sql = `
    insert into participants 
        (name, wallet_number, photo_public_id, photo_version, 
        phone_enc, phone_last4, phone_hash) 
    values
        ($1, $2, $3, $4, 
        pgp_sym_encrypt($5, $6, 'cipher-algo=aes256, compress-algo=1'),
        $7, $8)
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
  console.log('Obteniendo informacion')
  
  const { rows } = await pool.query(
    "select name, wallet_number, photo_public_id, photo_version, phone_last4, created_at from participants order by created_at desc"
  );

  return rows;
}

export async function getPublicIdsForPurge({ beforeDate } = {}) {
  const params = [];
  let sql = "SELECT photo_public_id FROM participants";
  if (beforeDate) {
    params.push(beforeDate);
    sql += " WHERE created_at < $1";
  }
  const { rows } = await pool.query(sql, params);
  return rows.map((r) => r.photo_public_id);
}

export async function purgeParticipants({ beforeDate } = {}) {
  const params = [];
  let sql = "DELETE FROM participants";
  if (beforeDate) {
    params.push(beforeDate);
    sql += " WHERE created_at < $1";
  }
  const { rowCount } = await pool.query(sql, params);
  return rowCount;
}
