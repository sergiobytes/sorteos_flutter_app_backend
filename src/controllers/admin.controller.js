import {
  getAllForExport,
  getPublicIdsForPurge,
  purgeParticipants,
} from "../services/participants.service.js";
import { streamZipWithExcelAndPhotos } from "../services/export.service.js";
import { deletePhotosByPublicIds } from "../services/cloudinary.service.js";

export async function exportZip(_req, res) {
  console.log('Exportando')
  
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

    const { deletePhotos = false, beforeDate } = req.body || {};

    // 1) Recolectar public_id por si se van a borrar fotos
    let publicIds = [];
    if (deletePhotos) {
      publicIds = await getPublicIdsForPurge({ beforeDate });
    }

    // 2) Borrar registros (retorna cantidad)
    const deletedCount = await purgeParticipants({ beforeDate });

    // 3) Borrar fotos si aplica
    let deletedPhotos = 0;
    if (deletePhotos && publicIds.length) {
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
