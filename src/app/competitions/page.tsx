import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, EmptyState, PageHeader } from "@/components/ui";

export default function CompetitionsPage() {
  return (
    <AppShell>
      <PageHeader kicker="תרגול משותף" title="תרגולים קצרים לכל הסגל על אותם חניכים" action={<Button href="/train"><Plus className="h-4 w-4" /> יצירת תרגול</Button>} />
      <EmptyState title="אין עדיין תרגולים משותפים" body="תרגולים משותפים יוצגו כאן אחרי שייווצרו מנתונים אמיתיים." action={<Button href="/train">מעבר לתרגול</Button>} />
    </AppShell>
  );
}
