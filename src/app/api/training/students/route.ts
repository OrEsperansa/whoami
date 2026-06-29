import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocalStudents } from "@/lib/local-store";

const useLocalStore = !process.env.DATABASE_URL;

export async function GET() {
  if (useLocalStore) {
    const students = await getLocalStudents();
    return NextResponse.json({
      students: students.map((student) => ({
        id: student.id,
        displayName: student.displayName,
        imageUrl: student.imageUrl,
      })),
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

    return NextResponse.json({ students });
  } catch {
    return NextResponse.json({ error: "לא ניתן לטעון חניכים לתרגול" }, { status: 500 });
  }
}
