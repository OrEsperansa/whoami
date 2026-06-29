import { AppShell } from "@/components/app-shell";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { getLiveCommanders } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const participants = await getLiveCommanders();

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
              {participants.map((user, index) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="py-3 text-xl font-semibold text-white">#{index + 1}</td>
                  <td><div className="flex items-center gap-3"><img src={user.avatar ?? "/logo.png"} alt="" className="h-10 w-10 rounded-md" /><span className="font-medium text-white">{user.name}</span></div></td>
                  <td>{user.xp.toLocaleString()}</td><td>0%</td><td>-</td><td>0</td><td>{user.streak}</td><td>0</td><td>0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {participants.length === 0 ? <div className="mt-4"><EmptyState title="אין מפקדים להצגה" body="הטבלה תתמלא אחרי שיוצרו מפקדים ויתחילו לתרגל." /></div> : null}
      </Card>
    </AppShell>
  );
}
