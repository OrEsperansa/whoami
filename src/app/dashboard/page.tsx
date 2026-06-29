import { Brain, Clock, Flame, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AccuracyChart, SpeedChart } from "@/components/charts";
import { Button, Card, EmptyState, PageHeader, Stat } from "@/components/ui";
import { getLiveCommanders, getLiveStudents } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [commanders, students] = await Promise.all([getLiveCommanders(), getLiveStudents()]);
  const user = commanders[0];

  return (
    <AppShell>
      <PageHeader
        kicker="לוח מפקד/ת"
        title={user ? `טוב שחזרת, ${user.name.split(" ")[0]}` : "לוח בקרה"}
        action={<Button href="/train"><Brain className="h-4 w-4" /> תרגול שמות ופנים</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="חניכים במאגר" value={students.length} detail="תמונות שנשמרו במערכת" />
        <Stat label="נקודות תרגול" value={(user?.xp ?? 0).toLocaleString()} />
        <Stat label="רצף תרגול" value={user?.streak ?? 0} detail="ימים עם תרגול" />
        <Stat label="מפקדים" value={commanders.length} detail="משתמשים שנוצרו" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <Target className="h-5 w-5 text-teal-300" />
          <p className="mt-4 text-3xl font-semibold text-white">{students.length}</p>
          <p className="text-sm text-zinc-400">חניכים זמינים לתרגול</p>
        </Card>
        <Card>
          <Clock className="h-5 w-5 text-sky-300" />
          <p className="mt-4 text-3xl font-semibold text-white">0</p>
          <p className="text-sm text-zinc-400">חניכים לחזרה היום</p>
        </Card>
        <Card>
          <Flame className="h-5 w-5 text-orange-300" />
          <p className="mt-4 text-3xl font-semibold text-white">0</p>
          <p className="text-sm text-zinc-400">אימונים שהושלמו</p>
        </Card>
      </div>

      {students.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="אין עדיין חניכים במאגר"
            body="העלו תמונות חניכים כדי שהלוח יציג נתונים אמיתיים."
            action={<Button href="/library">מעבר למאגר</Button>}
          />
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">מגמת דיוק</h2>
          <AccuracyChart />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">מגמת מהירות</h2>
          <SpeedChart />
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold text-white">היסטוריית אימונים אחרונה</h2>
        <p className="mt-4 rounded-md bg-white/[0.04] p-4 text-sm text-zinc-300">עדיין אין אימונים שנשמרו.</p>
      </Card>
    </AppShell>
  );
}
