import {
  getAllForExport,
  getPublicIdsForPurge,
  purgeParticipants,
  markWalletAsPaid,
} from "../services/participants.service.js";
import { streamZipWithExcelAndPhotos } from "../services/export.service.js";
import { deletePhotosByPublicIds } from "../services/cloudinary.service.js";

export async function exportZip(_req, res) {
  try {
    const rows = await getAllForExport();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sorteo_export.zip"
    );
    await streamZipWithExcelAndPhotos(rows, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).json({ error: "export_failed" });
  }
}

export async function purgeDatabase(req, res) {
  try {
    const confirm = (req.headers["x-confirm-purge"] || "")
      .toString()
      .toLowerCase();
    if (confirm !== "yes")
      return res.status(400).json({
        error: "missing_confirmation_header",
        hint: "Send header X-Confirm-Purge: yes",
      });

    // 1) Recolectar todos los public_id para borrar fotos (sin filtrar por fecha)
    const publicIds = await getPublicIdsForPurge();

    // 2) Borrar todos los registros (sin filtrar por fecha)
    const deletedCount = await purgeParticipants();

    // 3) Borrar fotos siempre que haya publicIds
    let deletedPhotos = 0;
    if (publicIds.length) {
      deletedPhotos = await deletePhotosByPublicIds(publicIds);
    }

    res.json({
      ok: true,
      deletedParticipants: deletedCount,
      deletedPhotos,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "purge_failed" });
  }
}

export async function markAsPaid(req, res) {
  try {
    const { participantId } = req.params;
    const { adminEmail } = req.body;

    const result = await markWalletAsPaid(participantId, adminEmail);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "participant_not_found" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal_server_error" });
  }
}
