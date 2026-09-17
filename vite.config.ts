import { promises as fs } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { formatValidationError, portfolioContentSchema } from "./src/content/content.schema.ts";

const contentPath = fileURLToPath(new URL("./src/content/content.json", import.meta.url));
const temporaryContentPath = fileURLToPath(new URL("./src/content/content.tmp.json", import.meta.url));
const imagesDirectory = fileURLToPath(new URL("./public/images/", import.meta.url));
const imageMimeExtensions = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
  ["image/x-icon", "ico"],
  ["image/vnd.microsoft.icon", "ico"],
]);

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage, maxBytes = 2_000_000): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBytes) throw new Error("Request body is too large");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function safeImageBaseName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "image";
}

function portfolioContentEditorPlugin(): Plugin {
  return {
    name: "portfolio-content-editor",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__portfolio-editor/content", async (req, res) => {
        try {
          if (req.method === "GET") {
            const parsed = portfolioContentSchema.safeParse(JSON.parse(await fs.readFile(contentPath, "utf8")));
            if (!parsed.success) return sendJson(res, 500, { error: formatValidationError(parsed.error) });
            return sendJson(res, 200, parsed.data);
          }

          if (req.method === "POST") {
            const parsed = portfolioContentSchema.safeParse(JSON.parse(await readBody(req)));
            if (!parsed.success) return sendJson(res, 400, { error: formatValidationError(parsed.error) });

            await fs.writeFile(temporaryContentPath, `${JSON.stringify(parsed.data, null, 2)}\n`, "utf8");
            await fs.rename(temporaryContentPath, contentPath);
            return sendJson(res, 200, { ok: true });
          }

          res.setHeader("Allow", "GET, POST");
          return sendJson(res, 405, { error: "Method not allowed" });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown filesystem error";
          return sendJson(res, 500, { error: message });
        }
      });

      server.middlewares.use("/__portfolio-editor/image", async (req, res) => {
        try {
          if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            return sendJson(res, 405, { error: "Method not allowed" });
          }

          const request: unknown = JSON.parse(await readBody(req, 12_000_000));
          if (!request || typeof request !== "object" || !("dataUrl" in request) || !("fileNameBase" in request)) {
            return sendJson(res, 400, { error: "An image and filename are required" });
          }

          const dataUrl = String(request.dataUrl);
          const fileNameBase = safeImageBaseName(String(request.fileNameBase));
          const match = /^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)$/i.exec(dataUrl);
          if (!match) return sendJson(res, 400, { error: "Invalid image data" });

          const mimeType = match[1]!.toLowerCase();
          const extension = imageMimeExtensions.get(mimeType);
          if (!extension) return sendJson(res, 400, { error: "Use a PNG, JPEG, WebP, GIF, AVIF, or ICO image" });

          const image = Buffer.from(match[2]!, "base64");
          if (!image.length || image.length > 8_000_000) {
            return sendJson(res, 400, { error: "Images must be smaller than 8 MB" });
          }

          const filename = `${fileNameBase}.${extension}`;
          const imagePath = fileURLToPath(new URL(`./public/images/${filename}`, import.meta.url));
          const temporaryImagePath = `${imagePath}.${randomUUID()}.tmp`;
          await fs.mkdir(imagesDirectory, { recursive: true });
          await fs.writeFile(temporaryImagePath, image);
          await fs.rename(temporaryImagePath, imagePath);
          return sendJson(res, 200, { path: `/images/${filename}` });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not save image";
          return sendJson(res, 500, { error: message });
        }
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), ...(command === "serve" ? [portfolioContentEditorPlugin()] : [])],
}));
