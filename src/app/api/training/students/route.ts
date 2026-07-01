import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocalStudents } from "@/lib/local-store";
import { getLatestMountedCycleId, getMountedCycleOptions, getMountedStudents } from "@/lib/cycle-images";

const useLocalStore = !process.env.DATABASE_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedCycleId = searchParams.get("cycleId");
  const [cycles, latestCycleId] = await Promise.all([getMountedCycleOptions(), getLatestMountedCycleId()]);
  const selectedCycleId = requestedCycleId || latestCycleId;
  const mountedStudents = selectedCycleId ? await getMountedStudents(selectedCycleId) : [];

  if (mountedStudents.length > 0 || requestedCycleId) {
    return NextResponse.json({
      students: mountedStudents.map((student) => ({
        id: student.id,
        displayName: student.displayName,
        imageUrl: student.imageUrl,
        cycleId: student.cycleId,
      })),
      cycles,
      latestCycleId,
      selectedCycleId,
    });
  }

  if (useLocalStore) {
    const students = await getLocalStudents();
    return NextResponse.json({
      students: students.map((student) => ({
        id: student.id,
        displayName: student.displayName,
        imageUrl: student.imageUrl,
      })),
      cycles,
      latestCycleId,
      selectedCycleId,
    });
  }

  try {
    const students = await prisma.person.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    });

    return NextResponse.json({ students, cycles, latestCycleId, selectedCycleId });
  } catch {
    return NextResponse.json({ error: "לא ניתן לטעון חניכים לתרגול" }, { status: 500 });
  }
}
