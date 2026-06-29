import { AppShell } from "@/components/app-shell";
import { Button, EmptyState, PageHeader } from "@/components/ui";

export default function TrainingSetsPage() {
  return (
    <AppShell>
      <PageHeader kicker="קבוצות חניכים" title="ארגון מחלקות וחניכים לתרגול" action={<Button>יצירת קבוצה</Button>} />
      <EmptyState title="אין עדיין קבוצות חניכים" body="קבוצות יוצגו כאן אחרי שיוגדרו על בסיס החניכים שהועלו." />
    </AppShell>
  );
}
