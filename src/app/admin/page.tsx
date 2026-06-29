import { ActivityChart } from "@/components/charts";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState, PageHeader, Stat } from "@/components/ui";
import { getLiveCommanders, getLiveCounts } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [participants, counts] = await Promise.all([getLiveCommanders(), getLiveCounts()]);

  return (
    <AppShell>
      <PageHeader kicker="ניהול מאגר" title="תמונת מצב על חניכים, תמונות והתקדמות מפקדים" action={<Button href="/library">ניהול מאגר חניכים</Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="מפקדים" value={counts.commanders} />
        <Stat label="חניכים במאגר" value={counts.students} />
        <Stat label="תרגולים" value={counts.attempts} />
        <Stat label="דיוק ממוצע" value="0%" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card><h2 className="mb-4 text-lg font-semibold text-white">פעילות תרגול לאורך זמן</h2><ActivityChart /></Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">חניכים שהכי מתבלבלים בהם</h2>
          <p className="mt-4 rounded-md bg-white/[0.04] p-4 text-sm text-zinc-300">עדיין אין מספיק נתוני תרגול.</p>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">התקדמות מפקדים</h2>
          {participants.length === 0 ? (
            <div className="mt-4"><EmptyState title="אין מפקדים" body="צרו מפקד/ת ממסך הכניסה." /></div>
          ) : (
            <div className="mt-4 space-y-3">{participants.map((user) => <div key={user.id} className="flex items-center justify-between rounded-md bg-white/[0.04] p-3"><span className="text-white">{user.name}</span><span>{user.xp} נקודות</span></div>)}</div>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">שיעורי שליטה לפי מחלקה</h2>
          <p className="mt-4 rounded-md bg-white/[0.04] p-4 text-sm text-zinc-300">קבוצות חניכים יוצגו כאן אחרי שיוגדרו.</p>
        </Card>
      </div>
    </AppShell>
  );
}
