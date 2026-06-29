import { AppShell } from "@/components/app-shell";
import { Button, EmptyState, PageHeader } from "@/components/ui";

export default function CompetitionPage() {
  return (
    <AppShell>
      <PageHeader kicker="תוצאות תרגול משותף" title="אין נתוני תרגול משותף" action={<Button href="/train">תרגול חוזר</Button>} />
      <EmptyState title="התרגול לא נמצא" body="אין במערכת תרגול משותף שמבוסס על הנתונים הקיימים." action={<Button href="/competitions" variant="secondary">חזרה לתרגולים</Button>} />
    </AppShell>
  );
}
