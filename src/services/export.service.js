import ExcelJS from "exceljs";
import archiver from "archiver";
import { signedPhotoUrl } from "./cloudinary.service.js";

async function fetchBuffer(url) {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const arr = await resp.arrayBuffer();
  return Buffer.from(arr);
}

function safeName(str) {
  return String(str || "").replace(/[^a-zA-Z0-9-_]/g, "_");
}

export async function streamZipWithExcelAndPhotos(rows, res) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Sorteo");

  ws.columns = [
    { header: "Nombre", key: "name", width: 30 },
    { header: "Cartera", key: "wallet", width: 16 },
    { header: "Teléfono", key: "phone", width: 22 },
    { header: "Fecha", key: "date", width: 24 },
  ];

  rows.forEach((r) =>
    ws.addRow({
      name: r.name,
      wallet: r.wallet_number,
      phone: r.phone_full,
      date: new Date(r.created_at).toLocaleString('es-MX', { 
        timeZone: process.env.TZ || 'America/Hermosillo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    })
  );

  const excelBuffer = await wb.xlsx.writeBuffer();

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(res);

  archive.append(Buffer.from(excelBuffer), { name: "sorteo.xlsx" });

  const expireSec = 180;

  for (const r of rows) {
    if (!r.photo_public_id) continue;
    const url = signedPhotoUrl(r.photo_public_id, expireSec);
    const buf = await fetchBuffer(url);
    
    if (buf) {
      const base = `${safeName(r.wallet_number)}-${safeName(r.name)}`;
      archive.append(buf, { name: `fotos/${base}.jpg` });
    }
  }

  await archive.finalize();
}
