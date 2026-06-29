import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { avatarUrl } from "@/lib/utils";
import { addLocalCommander, getLocalCommanders } from "@/lib/local-store";

const useLocalStore = !process.env.DATABASE_URL;

const commanderSchema = z.object({
  name: z.string().trim().min(2, "שם מפקד/ת חייב להכיל לפחות 2 תווים").max(80),
});

export async function GET() {
  if (useLocalStore) {
    const commanders = await getLocalCommanders();
    return NextResponse.json({ commanders });
  }

  try {
    const commanders = await prisma.user.findMany({
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

    return NextResponse.json({ commanders });
  } catch {
    return NextResponse.json({ error: "לא ניתן לטעון מפקדים מבסיס הנתונים" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = commanderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "שם לא תקין" }, { status: 400 });
    }

    if (useLocalStore) {
      const commander = await addLocalCommander(parsed.data.name, avatarUrl(parsed.data.name, "0f766e"));
      return NextResponse.json({ commander }, { status: 201 });
    }

    const commander = await prisma.user.create({
      data: {
        name: parsed.data.name,
        avatar: avatarUrl(parsed.data.name, "0f766e"),
        role: Role.PARTICIPANT,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        streak: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ commander }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "לא ניתן ליצור מפקד/ת כרגע" }, { status: 500 });
  }
}
