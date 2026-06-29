import { ActivityChart } from "@/components/charts";
import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader, Stat } from "@/components/ui";
import { attempts, categories, people, users } from "@/lib/demo-data";

export default function AdminPage() {
  const participants = users.filter((user) => user.role === "participant");
  const hardest = [...people].sort((a, b) => b.mistakes - a.mistakes).slice(0, 5);
  return (
    <AppShell>
      <PageHeader kicker="ניהול מאגר" title="תמונת מצב על חניכים, תמונות והתקדמות מפקדים" action={<Button href="/library">ניהול מאגר חניכים</Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="מפקדים" value={participants.length} />
        <Stat label="חניכים במאגר" value={people.length} />
        <Stat label="תרגולים" value={attempts.length} />
        <Stat label="דיוק ממוצע" value="88%" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card><h2 className="mb-4 text-lg font-semibold text-white">פעילות תרגול לאורך זמן</h2><ActivityChart /></Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">חניכים שהכי מתבלבלים בהם</h2>
          <div className="mt-4 space-y-3">{hardest.map((person) => <div key={person.id} className="flex items-center justify-between rounded-md bg-white/[0.04] p-3"><span className="text-white">{person.displayName}</span><span className="text-rose-300">{person.mistakes} טעויות</span></div>)}</div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">התקדמות מפקדים</h2>
          <div className="mt-4 space-y-3">{participants.map((user) => <div key={user.id} className="flex items-center justify-between rounded-md bg-white/[0.04] p-3"><span className="text-white">{user.name}</span><span>{user.accuracy}% דיוק</span></div>)}</div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">שיעורי שליטה לפי מחלקה</h2>
          <div className="mt-4 space-y-3">{categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded-md bg-white/[0.04] p-3"><span className="text-white">{category.name}</span><span>{category.mastery}%</span></div>)}</div>
        </Card>
      </div>
    </AppShell>
  );
}
