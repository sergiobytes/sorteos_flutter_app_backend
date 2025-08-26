import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "ine-photos";

export async function buildUploadSignature() {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToString = { folder: FOLDER, timestamp, type: "authenticated" };
  const signature = cloudinary.utils.api_sign_request(
    paramsToString,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder: FOLDER,
    type: "authenticated",
  };
}

export function signedPhotoUrl(publicId, seconds = 100) {
  const expire_at = Math.floor(Date.now() / 1000) + seconds;

  return cloudinary.url(publicId, {
    resource_type: "image",
    type: "authenticated",
    sign_url: true,
    expire_at,
    transformation: [{ fecth_format: "jpg" }],
  });
}

export async function deletePhotosByPublicIds(publicIds = []) {
  if (!publicIds.length) return 0;

  // Cloudinary recomienda lotes de hasta 100
  const chunks = [];
  for (let i = 0; i < publicIds.length; i += 100) {
    chunks.push(publicIds.slice(i, i + 100));
  }

  let totalDeleted = 0;
  for (const batch of chunks) {
    const resp = await cloudinary.api.delete_resources(batch, {
      resource_type: "image",
      type: "authenticated",
    });
    // resp.deleted = { "<public_id>": "deleted" | "not_found" | "error" }
    totalDeleted += Object.values(resp.deleted || {}).filter(
      (v) => v === "deleted"
    ).length;
  }
  return totalDeleted;
}
