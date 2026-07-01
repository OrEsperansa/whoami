import { Role } from "@prisma/client";
import { getLocalCommanders, getLocalStudents } from "@/lib/local-store";
import { prisma } from "@/lib/prisma";
import { getMountedStudents } from "@/lib/cycle-images";

const useLocalStore = !process.env.DATABASE_URL;

export type LiveCommander = {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  streak: number;
  createdAt: Date | string;
};

export type LiveStudent = {
  id: string;
  displayName: string;
  imageUrl: string;
  createdAt: Date | string;
  cycleId?: string;
};

export async function getLiveCommanders(): Promise<LiveCommander[]> {
  if (useLocalStore) {
    return getLocalCommanders();
  }

  return prisma.user.findMany({
    where: { role: Role.PARTICIPANT },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      avatar: true,
      xp: true,
      streak: true,
      createdAt: true,
    },
  });
}

export async function getLiveStudents(): Promise<LiveStudent[]> {
  const mountedStudents = await getMountedStudents();

  if (useLocalStore) {
    const students = await getLocalStudents();
    return [
      ...mountedStudents,
      ...students.map((student) => ({
        id: student.id,
        displayName: student.displayName,
        imageUrl: student.imageUrl,
        createdAt: student.createdAt,
      })),
    ];
  }

  const students = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      displayName: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  return [...mountedStudents, ...students];
}

export async function getLiveCounts() {
  const mountedStudents = await getMountedStudents();

  if (useLocalStore) {
    const [commanders, students] = await Promise.all([getLocalCommanders(), getLocalStudents()]);
    return {
      commanders: commanders.length,
      students: mountedStudents.length + students.length,
      attempts: 0,
    };
  }

  const [commanders, students, attempts] = await Promise.all([
    prisma.user.count({ where: { role: Role.PARTICIPANT } }),
    prisma.person.count(),
    prisma.trainingAttempt.count(),
  ]);

  return { commanders, students: mountedStudents.length + students, attempts };
}
