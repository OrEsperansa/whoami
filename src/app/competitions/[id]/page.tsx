import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader } from "@/components/ui";
import { competitions, users } from "@/lib/demo-data";
import { ms } from "@/lib/utils";

export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const competition = competitions.find((item) => item.id === id) ?? competitions[0];
  return (
    <AppShell>
      <PageHeader kicker="תוצאות תרגול משותף" title={competition.title} action={<Button href="/train/session/demo">תרגול חוזר</Button>} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-right text-sm">
            <thead className="text-zinc-500"><tr><th className="py-2">מקום</th><th>משתמש</th><th>ניקוד</th><th>דיוק</th><th>מהירות ממוצעת</th></tr></thead>
            <tbody>
              {competition.results.sort((a, b) => b.score - a.score).map((result, index) => {
                const user = users.find((item) => item.id === result.userId);
                return (
                  <tr key={result.userId} className="border-t border-white/10">
                    <td className="py-3 text-xl font-semibold text-white">#{index + 1}</td>
                    <td><div className="flex items-center gap-3"><img src={user?.avatar} alt="" className="h-10 w-10 rounded-md" /><span className="font-medium text-white">{user?.name}</span></div></td>
                    <td>{result.score.toLocaleString()}</td><td>{result.accuracy}%</td><td>{ms(result.averageResponseTimeMs)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="mt-4">
        <h2 className="font-semibold text-white">איך מחושב הניקוד</h2>
        <p className="mt-2 text-sm text-zinc-400">המטרה היא לעזור לסגל להבין מי כבר מכיר את החניכים ומי צריך עוד תרגול. הדיוק חשוב יותר מהמהירות.</p>
      </Card>
    </AppShell>
  );
}
