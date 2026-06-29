import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader } from "@/components/ui";
import { trainingSets } from "@/lib/demo-data";

export default function TrainingSetsPage() {
  return (
    <AppShell>
      <PageHeader kicker="קבוצות חניכים" title="ארגון מחלקות וחניכים לתרגול" action={<Button>יצירת קבוצה</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {trainingSets.map((set) => (
          <Card key={set.id}>
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-semibold text-white">{set.name}</h2><p className="mt-1 text-sm text-zinc-400">{set.description}</p></div>
              <span className="rounded-full bg-teal-400/15 px-3 py-1 text-sm text-teal-300">{set.isActive ? "פעיל" : "מושהה"}</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
              <span className="rounded-md bg-white/[0.04] p-3"><b className="block text-white">{set.personIds.length}</b>חניכים</span>
              <span className="rounded-md bg-white/[0.04] p-3"><b className="block text-white">{set.categoryIds.length}</b>מחלקות</span>
              <span className="rounded-md bg-white/[0.04] p-3"><b className="block text-white">{set.difficultyRange.join("-")}</b>רמות</span>
            </div>
            <Button variant="secondary" className="mt-5">עריכת קבוצה</Button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
