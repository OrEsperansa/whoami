import path from "node:path";

const defaultUploadDir = path.join(process.cwd(), "public", "uploads");

export function getUploadDir() {
  return defaultUploadDir;
}

export function uploadedFilePath(fileName: string) {
  const resolvedUploadDir = path.resolve(getUploadDir());
  const resolvedPath = path.resolve(resolvedUploadDir, fileName);

  if (resolvedPath !== resolvedUploadDir && !resolvedPath.startsWith(`${resolvedUploadDir}${path.sep}`)) {
    throw new Error("Invalid upload path");
  }

  return resolvedPath;
}

export function uploadedFileUrl(fileName: string) {
  return `/uploads/${fileName}`;
}

export function uploadedFileNameFromUrl(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) return null;
  return path.basename(imageUrl);
}
