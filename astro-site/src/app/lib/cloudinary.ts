// Cloudinary Client Integration for Tech Dental Care

export const CLOUDINARY_CLOUD_NAME = "aijtiabn";
export const CLOUDINARY_UPLOAD_PRESET = "TechDental";
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  sizeFormatted: string;
}

/**
 * Format bytes to readable string (e.g. 120 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Upload an image file directly to Cloudinary using the Unsigned preset
 */
export async function uploadToCloudinary(
  file: File | Blob,
  fileName?: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  if (fileName) {
    const cleanPublicId = `techdental_${Date.now()}_${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    formData.append("public_id", cleanPublicId);
  }

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }

  return {
    url: data.secure_url || data.url,
    public_id: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    sizeFormatted: formatBytes(data.bytes),
  };
}

/**
 * Generates an optimized Cloudinary delivery URL with auto WebP/AVIF format and responsive sizing
 */
export function getOptimizedImageUrl(
  url: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string }
): string {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  // Find the /upload/ segment in Cloudinary URL
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const transforms: string[] = ["f_auto", "q_auto"];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);

  const transformString = transforms.join(",");
  const prefix = url.slice(0, uploadIndex + 8);
  const suffix = url.slice(uploadIndex + 8);

  // Avoid duplicate transforms
  if (suffix.startsWith("f_auto") || suffix.startsWith("w_") || suffix.startsWith("q_auto")) {
    return url;
  }

  return `${prefix}${transformString}/${suffix}`;
}
