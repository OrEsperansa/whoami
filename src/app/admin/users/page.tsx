import { AppShell } from "@/components/app-shell";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { getLiveCommanders } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getLiveCommanders();

  return (
    <AppShell>
      <PageHeader kicker="מפקדים" title="מעקב פשוט אחרי התקדמות הסגל" />
      <Card>
        <input className="mb-4 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" placeholder="חיפוש מפקדים" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="text-zinc-500"><tr><th className="py-2">שם</th><th>תפקיד</th><th>נקודות</th><th>דיוק</th><th>מהירות ממוצעת</th><th>חניכים בשליטה</th><th>רצף</th></tr></thead>
            <tbody>{users.map((user) => <tr key={user.id} className="border-t border-white/10"><td className="py-3 text-white">{user.name}</td><td>מפקד/ת</td><td>{user.xp}</td><td>0%</td><td>-</td><td>0</td><td>{user.streak}</td></tr>)}</tbody>
          </table>
        </div>
        {users.length === 0 ? <div className="mt-4"><EmptyState title="אין מפקדים" body="הרשימה תתמלא אחרי שתצרו מפקד/ת ממסך הכניסה." /></div> : null}
      </Card>
    </AppShell>
  );
}
