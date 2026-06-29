import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addLocalStudents, clearLocalStudents, getLocalStudents, type LocalStudent } from "@/lib/local-store";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const useLocalStore = !process.env.DATABASE_URL;

function studentNameFromFileName(fileName: string) {
  const parsed = path.parse(fileName);
  return parsed.name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function splitName(displayName: string) {
  const parts = displayName.split(" ").filter(Boolean);
  return {
    firstName: parts[0] ?? displayName,
    lastName: parts.slice(1).join(" "),
  };
}

function safeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension) ? extension : ".jpg";
}

function databaseErrorMessage(action: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("does not exist") || message.includes("P2021") || message.includes("P2022")) {
    return `${action}: טבלאות בסיס הנתונים עדיין לא נוצרו. הריצו npm run prisma:push או הפעילו את db-setup/Helm migration job.`;
  }

  if (message.includes("Can't reach database") || message.includes("ECONNREFUSED") || message.includes("connection")) {
    return `${action}: לא ניתן להתחבר לבסיס הנתונים. בדקו את DATABASE_URL ואת זמינות Postgres.`;
  }

  return `${action}: ${message.split("\n")[0]}`;
}

async function persistImage(file: File, bytes: Buffer) {
  const extension = safeExtension(file.name);
  const storedFileName = `${crypto.randomUUID()}${extension}`;
  const relativeUrl = `/uploads/${storedFileName}`;

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, storedFileName), bytes);
    return relativeUrl;
  } catch (error) {
    console.warn("Could not write uploaded image to filesystem. Falling back to database data URL.", error);
    const contentType = file.type || "image/jpeg";
    return `data:${contentType};base64,${bytes.toString("base64")}`;
  }
}

export async function GET() {
  if (useLocalStore) {
    const students = await getLocalStudents();
    return NextResponse.json({ students });
  }

  try {
    const students = await prisma.person.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        displayName: true,
        imageUrl: true,
        notes: true,
        tags: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to load students", error);
    return NextResponse.json({ error: databaseErrorMessage("לא ניתן לטעון חניכים מבסיס הנתונים", error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "בחרו לפחות תמונה אחת להעלאה" }, { status: 400 });
    }

    const createdStudents = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const displayName = studentNameFromFileName(file.name);
      if (!displayName) {
        continue;
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const imageUrl = await persistImage(file, bytes);

      const { firstName, lastName } = splitName(displayName);
      if (useLocalStore) {
        const student: LocalStudent = {
          id: crypto.randomUUID(),
          firstName,
          lastName,
          displayName,
          imageUrl,
          notes: `נוצר אוטומטית מהקובץ ${file.name}`,
          tags: [],
          createdAt: new Date().toISOString(),
        };
        createdStudents.push(student);
        continue;
      }

      const student = await prisma.person.create({
        data: {
          firstName,
          lastName,
          displayName,
          imageUrl,
          notes: `נוצר אוטומטית מהקובץ ${file.name}`,
          tags: [],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          imageUrl: true,
          notes: true,
          tags: true,
          createdAt: true,
        },
      });

      createdStudents.push(student);
    }

    if (createdStudents.length === 0) {
      return NextResponse.json({ error: "לא נמצאו קבצי תמונה תקינים להעלאה" }, { status: 400 });
    }

    if (useLocalStore) {
      await addLocalStudents(createdStudents as LocalStudent[]);
    }

    return NextResponse.json({ students: createdStudents }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload students", error);
    return NextResponse.json({ error: databaseErrorMessage("העלאת החניכים נכשלה", error) }, { status: 500 });
  }
}

export async function DELETE() {
  if (useLocalStore) {
    const students = await clearLocalStudents();
    await Promise.allSettled(
      students
        .filter((student) => student.imageUrl.startsWith("/uploads/"))
        .map((student) => unlink(path.join(process.cwd(), "public", student.imageUrl))),
    );
    return NextResponse.json({ deleted: students.length });
  }

  try {
    const students = await prisma.person.findMany({
      select: { id: true, imageUrl: true },
    });

    await prisma.trainingAttempt.deleteMany({
      where: { personId: { in: students.map((student) => student.id) } },
    });
    await prisma.userPersonProgress.deleteMany({
      where: { personId: { in: students.map((student) => student.id) } },
    });
    await prisma.person.deleteMany();

    await Promise.allSettled(
      students
        .filter((student) => student.imageUrl.startsWith("/uploads/"))
        .map((student) => unlink(path.join(process.cwd(), "public", student.imageUrl))),
    );

    return NextResponse.json({ deleted: students.length });
  } catch (error) {
    console.error("Failed to delete students", error);
    return NextResponse.json({ error: databaseErrorMessage("מחיקת החניכים נכשלה", error) }, { status: 500 });
  }
}
