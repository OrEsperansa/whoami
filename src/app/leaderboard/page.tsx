import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { users } from "@/lib/demo-data";
import { ms } from "@/lib/utils";

export default function LeaderboardPage() {
  const participants = users.filter((user) => user.role === "participant").sort((a, b) => a.rank - b.rank);
  return (
    <AppShell>
      <PageHeader kicker="התקדמות מפקדים" title="מי כבר מכיר טוב את חניכי הקורס" />
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2">
          {["כל הקורס", "השבוע", "החודש", "קבוצת חניכים", "מחלקה"].map((filter) => <button key={filter} className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10">{filter}</button>)}
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right text-sm">
            <thead className="text-zinc-500"><tr><th className="py-2">#</th><th>מפקד/ת</th><th>נקודות</th><th>דיוק</th><th>מהירות ממוצעת</th><th>חניכים בשליטה</th><th>רצף</th><th>שבועי</th><th>חודשי</th></tr></thead>
            <tbody>
              {participants.map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="py-3 text-xl font-semibold text-white">#{user.rank}</td>
                  <td><div className="flex items-center gap-3"><img src={user.avatar} alt="" className="h-10 w-10 rounded-md" /><span className="font-medium text-white">{user.name}</span></div></td>
                  <td>{user.xp.toLocaleString()}</td><td>{user.accuracy}%</td><td>{ms(user.avgMs)}</td><td>{user.mastered}</td><td>{user.streak}</td><td>{user.weeklyScore}</td><td>{user.monthlyScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
