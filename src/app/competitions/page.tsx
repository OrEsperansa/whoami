import { Plus, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader } from "@/components/ui";
import { competitions, trainingSets, users } from "@/lib/demo-data";

export default function CompetitionsPage() {
  return (
    <AppShell>
      <PageHeader kicker="תרגול משותף" title="תרגולים קצרים לכל הסגל על אותם חניכים" action={<Button href="/competitions/c1"><Plus className="h-4 w-4" /> יצירת תרגול</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {competitions.map((competition) => {
          const set = trainingSets.find((item) => item.id === competition.trainingSetId);
          const winner = users.find((user) => user.id === competition.results[0]?.userId);
          return (
            <Card key={competition.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{competition.title}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{set?.name} · רמות {competition.levelRange.join("-")} · {competition.questionCount} שאלות</p>
                </div>
                <Trophy className="h-6 w-6 text-orange-300" />
              </div>
              <div className="mt-6 rounded-md bg-white/[0.04] p-3">
                <p className="text-sm text-zinc-400">התקדמות מובילה</p>
                <p className="mt-1 font-semibold text-white">{winner?.name} · {competition.results[0]?.score.toLocaleString()} נקודות</p>
              </div>
              <Button href={`/competitions/${competition.id}`} className="mt-5">צפייה בהתקדמות</Button>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
