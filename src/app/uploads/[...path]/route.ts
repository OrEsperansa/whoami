import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type UploadRouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: UploadRouteContext) {
  const params = await context.params;
  const fileName = params.path.at(-1);

  if (!fileName) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const resolvedUploadDir = path.resolve(uploadDir);
    const filePath = path.resolve(resolvedUploadDir, path.basename(fileName));
    if (!filePath.startsWith(`${resolvedUploadDir}${path.sep}`)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const body = await readFile(filePath);
    const contentType = contentTypes[path.extname(fileName).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
