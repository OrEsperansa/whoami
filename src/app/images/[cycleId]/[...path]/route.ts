import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { mountedImagePath } from "@/lib/cycle-images";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type ImageRouteContext = {
  params: Promise<{ cycleId: string; path: string[] }>;
};

export async function GET(_request: Request, context: ImageRouteContext) {
  const { cycleId, path: routePath } = await context.params;
  const fileName = routePath.at(-1);

  if (!fileName) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = mountedImagePath(cycleId, fileName);
    const body = await readFile(filePath);
    const contentType = contentTypes[path.extname(fileName).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
