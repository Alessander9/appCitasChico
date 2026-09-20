/**
 * Subida sin firmar (unsigned) a Cloudinary desde el navegador.
 * Requiere un Upload Preset en modo "Unsigned".
 */
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export type UploadResult = { url: string; publicId: string };

export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  if (!CLOUD || !PRESET) {
    throw new Error(
      "Faltan VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET en .env.local"
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else {
          reject(new Error(data?.error?.message ?? "Error al subir la imagen"));
        }
      } catch {
        reject(new Error("Respuesta inválida de Cloudinary"));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red al subir la imagen"));
    xhr.send(form);
  });
}

/** URL recortada cuadrada para avatares (transformación en caliente de Cloudinary). */
export function squareUrl(url: string, size = 96): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/w_${size},h_${size},c_fill,g_face,q_auto,f_auto/`);
}

/** URL optimizada para fotos de servicios/hero. */
export function optimizeUrl(url: string, width = 800): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}
