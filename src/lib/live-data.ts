import { Role } from "@prisma/client";
import { getLocalCommanders, getLocalStudents } from "@/lib/local-store";
import { prisma } from "@/lib/prisma";

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
  if (useLocalStore) {
    const students = await getLocalStudents();
    return students.map((student) => ({
      id: student.id,
      displayName: student.displayName,
      imageUrl: student.imageUrl,
      createdAt: student.createdAt,
    }));
  }

  return prisma.person.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      displayName: true,
      imageUrl: true,
      createdAt: true,
    },
  });
}

export async function getLiveCounts() {
  if (useLocalStore) {
    const [commanders, students] = await Promise.all([getLocalCommanders(), getLocalStudents()]);
    return {
      commanders: commanders.length,
      students: students.length,
      attempts: 0,
    };
  }

  const [commanders, students, attempts] = await Promise.all([
    prisma.user.count({ where: { role: Role.PARTICIPANT } }),
    prisma.person.count(),
    prisma.trainingAttempt.count(),
  ]);

  return { commanders, students, attempts };
}
