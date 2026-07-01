import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const imagesDir = path.join(process.cwd(), "images");
const cyclePattern = /^sigit\d+$/i;
const imageExtensions = new Set([".gif", ".jpg", ".jpeg", ".png", ".webp"]);

export type CycleImageStudent = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl: string;
  notes: string | null;
  tags: unknown[];
  createdAt: string;
  cycleId: string;
  source: "mounted";
};

export type CycleOption = {
  id: string;
  studentCount: number;
};

function displayNameFromFileName(fileName: string) {
  return path.parse(fileName).name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function splitName(displayName: string) {
  const parts = displayName.split(" ").filter(Boolean);
  return {
    firstName: parts[0] ?? displayName,
    lastName: parts.slice(1).join(" "),
  };
}

function sortCycles(cycles: string[]) {
  return [...cycles].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function mountedImageUrl(cycleId: string, fileName: string) {
  return `/images/${encodeURIComponent(cycleId)}/${encodeURIComponent(fileName)}`;
}

export function mountedImagePath(cycleId: string, fileName: string) {
  if (!cyclePattern.test(cycleId)) {
    throw new Error("Invalid cycle id");
  }

  const resolvedCycleDir = path.resolve(imagesDir, cycleId);
  const resolvedPath = path.resolve(resolvedCycleDir, path.basename(fileName));

  if (!resolvedPath.startsWith(`${resolvedCycleDir}${path.sep}`)) {
    throw new Error("Invalid image path");
  }

  return resolvedPath;
}

export async function getMountedCycleIds() {
  try {
    const entries = await readdir(imagesDir, { withFileTypes: true });
    return sortCycles(entries.filter((entry) => entry.isDirectory() && cyclePattern.test(entry.name)).map((entry) => entry.name));
  } catch {
    return [];
  }
}

export async function getLatestMountedCycleId() {
  const cycles = await getMountedCycleIds();
  return cycles.at(-1) ?? null;
}

export async function getMountedCycleStudents(cycleId: string): Promise<CycleImageStudent[]> {
  if (!cyclePattern.test(cycleId)) return [];

  let files: string[];
  try {
    files = await readdir(path.join(imagesDir, cycleId));
  } catch {
    return [];
  }

  const students = await Promise.all(
    files.map(async (fileName): Promise<CycleImageStudent | null> => {
      const extension = path.extname(fileName).toLowerCase();
      if (!imageExtensions.has(extension)) return null;

      try {
        const fileStat = await stat(mountedImagePath(cycleId, fileName));
        if (!fileStat.isFile()) return null;

        const displayName = displayNameFromFileName(fileName);
        if (!displayName) return null;

        const { firstName, lastName } = splitName(displayName);
        return {
          id: `mounted:${cycleId}:${fileName}`,
          firstName,
          lastName,
          displayName,
          imageUrl: mountedImageUrl(cycleId, fileName),
          notes: `${cycleId} mounted image`,
          tags: [cycleId],
          createdAt: fileStat.mtime.toISOString(),
          cycleId,
          source: "mounted" as const,
        };
      } catch {
        return null;
      }
    }),
  );

  const mountedStudents: CycleImageStudent[] = students.filter((student): student is CycleImageStudent => Boolean(student));
  return mountedStudents.sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }));
}

export async function getMountedStudents(cycleId?: string | null) {
  const selectedCycleId = cycleId ?? null;
  const cycles = selectedCycleId ? [selectedCycleId] : await getMountedCycleIds();
  const studentsByCycle = await Promise.all(cycles.map((id) => getMountedCycleStudents(id)));
  return studentsByCycle.flat();
}

export async function getMountedCycleOptions(): Promise<CycleOption[]> {
  const cycles = await getMountedCycleIds();
  const studentsByCycle = await Promise.all(cycles.map((id) => getMountedCycleStudents(id)));
  return cycles.map((id, index) => ({
    id,
    studentCount: studentsByCycle[index]?.length ?? 0,
  }));
}
