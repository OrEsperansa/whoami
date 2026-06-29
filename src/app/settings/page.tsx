import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader kicker="הגדרות" title="פרטיות, אחסון והעדפות תרגול" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">פרטיות ובטיחות</h2>
          <p className="mt-3 rounded-md border border-teal-300/20 bg-teal-300/10 p-3 text-sm text-teal-100">העלו רק תמונות של חניכים שיש לכם הרשאה להשתמש בהן במסגרת הקורס.</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>אין שימוש בממשקי API חיצוניים לזיהוי פנים.</p>
            <p>לא נשמרות תבניות ביומטריות או מדידות פנים נגזרות.</p>
            <p>התמונות מקושרות ידנית לשמות החניכים שהוזנו במאגר.</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">אחסון</h2>
          <label className="mt-4 block text-sm text-zinc-300">מצב אחסון תמונות<select className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3"><option>העלאות מקומיות</option><option>אחסון Supabase</option></select></label>
          <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300"><input type="checkbox" defaultChecked className="accent-teal-400" /> מחיקת קבצי אחסון משויכים בעת הסרת חניך.</label>
          <Button className="mt-5">שמירת הגדרות</Button>
        </Card>
      </div>
    </AppShell>
  );
}
