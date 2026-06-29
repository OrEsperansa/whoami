import { AppShell } from "@/components/app-shell";
import { Card, PageHeader } from "@/components/ui";
import { users } from "@/lib/demo-data";
import { ms } from "@/lib/utils";

export default function AdminUsersPage() {
  return (
    <AppShell>
      <PageHeader kicker="מפקדים" title="מעקב פשוט אחרי התקדמות הסגל" />
      <Card>
        <input className="mb-4 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" placeholder="חיפוש מפקדים" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead className="text-zinc-500"><tr><th className="py-2">שם</th><th>תפקיד</th><th>נקודות</th><th>דיוק</th><th>מהירות ממוצעת</th><th>חניכים בשליטה</th><th>רצף</th></tr></thead>
            <tbody>{users.map((user) => <tr key={user.id} className="border-t border-white/10"><td className="py-3 text-white">{user.name}</td><td>{user.role === "admin" ? "אחראי מאגר" : "מפקד/ת"}</td><td>{user.xp}</td><td>{user.accuracy}%</td><td>{user.avgMs ? ms(user.avgMs) : "-"}</td><td>{user.mastered}</td><td>{user.streak}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
