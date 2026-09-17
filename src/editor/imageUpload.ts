const acceptedImageTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

export const acceptedImageTypesLabel = "PNG, JPEG, WebP, GIF, AVIF, or ICO up to 8 MB";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(new Error("Could not read this image")));
    reader.readAsDataURL(file);
  });
}

export async function uploadPortfolioImage(file: File, fileNameBase: string): Promise<string> {
  if (!acceptedImageTypes.has(file.type)) throw new Error(`Use ${acceptedImageTypesLabel.toLowerCase()}`);
  if (file.size > 8_000_000) throw new Error("Images must be smaller than 8 MB");

  const response = await fetch("/__portfolio-editor/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataUrl: await readAsDataUrl(file), fileNameBase }),
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    throw new Error(typeof body === "object" && body && "error" in body ? String(body.error) : "Could not save image");
  }
  if (!body || typeof body !== "object" || !("path" in body)) throw new Error("The image endpoint returned an invalid response");
  return String(body.path);
}
