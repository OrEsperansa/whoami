import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), ".local-data");

export type LocalCommander = {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  streak: number;
  createdAt: string;
};

export type LocalStudent = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl: string;
  notes: string | null;
  tags: unknown[];
  createdAt: string;
};

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(path.join(dataDir, fileName), "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(fileName: string, value: T) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, fileName), JSON.stringify(value, null, 2), "utf8");
}

export async function getLocalCommanders() {
  return readJson<LocalCommander[]>("commanders.json", []);
}

export async function addLocalCommander(name: string, avatar: string | null) {
  const commanders = await getLocalCommanders();
  const commander: LocalCommander = {
    id: crypto.randomUUID(),
    name,
    avatar,
    xp: 0,
    streak: 0,
    createdAt: new Date().toISOString(),
  };
  await writeJson("commanders.json", [...commanders, commander]);
  return commander;
}

export async function getLocalStudents() {
  return readJson<LocalStudent[]>("students.json", []);
}

export async function addLocalStudents(students: LocalStudent[]) {
  const existing = await getLocalStudents();
  await writeJson("students.json", [...students, ...existing]);
}

export async function clearLocalStudents() {
  const existing = await getLocalStudents();
  await writeJson("students.json", []);
  return existing;
}
