import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { getLiveStudents } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function LibraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const students = await getLiveStudents();
  const student = students.find((item) => item.id === id);

  if (!student) {
    return (
      <AppShell>
        <PageHeader kicker="עריכת חניך/ה" title="החניך לא נמצא" />
        <EmptyState title="אין חניך כזה במאגר" body="העמוד מציג רק חניכים אמיתיים שנשמרו במערכת." action={<Button href="/library">חזרה למאגר</Button>} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader kicker="עריכת חניך/ה" title={student.displayName} />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card><img src={student.imageUrl} alt="" className="aspect-square w-full rounded-md object-cover" /><Button href="/library" variant="secondary" className="mt-4 w-full">חזרה למאגר</Button></Card>
        <Card>
          <label className="text-sm text-zinc-300">שם להצגה<input defaultValue={student.displayName} readOnly className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" /></label>
          <p className="mt-4 text-sm text-zinc-400">עריכה מלאה תתווסף בהמשך. כרגע הנתון מגיע מהקובץ שהועלה.</p>
        </Card>
      </div>
    </AppShell>
  );
}
