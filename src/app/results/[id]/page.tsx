import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { ms } from "@/lib/utils";

export default async function ResultsPage({ searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ answers?: string }> }) {
  const query = await searchParams;
  const answers = query.answers ? JSON.parse(decodeURIComponent(query.answers)) as { correct: boolean; score: number; ms: number; personId: string }[] : [];
  const total = answers.length;
  const correct = answers.filter((answer) => answer.correct).length;
  const score = answers.reduce((sum, answer) => sum + answer.score, 0);
  const avg = total > 0 ? Math.round(answers.reduce((sum, answer) => sum + answer.ms, 0) / total) : 0;
  const missedCount = answers.filter((answer) => !answer.correct).length;

  return (
    <AppShell>
      <PageHeader kicker="תוצאות התרגול" title="עבודה טובה. עכשיו יודעים על מי צריך לחזור." />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="ניקוד" value={score.toLocaleString()} detail="נקודות שנצברו בתרגול" />
        <Stat label="דיוק" value={`${total > 0 ? Math.round((correct / total) * 100) : 0}%`} detail={`${correct}/${total} נכונות`} />
        <Stat label="מהירות ממוצעת" value={ms(avg)} detail="זמן תגובה לתשובה" />
        <Stat label="הרצף הארוך ביותר" value={correct} detail="מומנטום נקי" />
      </div>
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">התקדמות בזכירת החניכים</h2>
            <p className="mt-1 text-sm text-zinc-400">חניכים שזיהיתם נכון יתרחקו, וחניכים שהתבלבלתם בהם יחזרו מוקדם יותר.</p>
          </div>
          <p className="text-2xl font-semibold text-teal-300">+12%</p>
        </div>
        <div className="mt-5"><ProgressBar value={72} /></div>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-lg font-semibold text-white">חניכים שפספסת</h2>
          <p className="mt-4 rounded-md bg-white/[0.04] p-4 text-sm text-zinc-300">
            {missedCount > 0 ? `${missedCount} תשובות לא היו נכונות. מומלץ להריץ עוד סבב באותה רמה.` : "לא פספסת אף חניך בסבב הזה."}
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">הפעולה הבאה הטובה ביותר</h2>
          <div className="mt-5 space-y-3">
            <Button href="/train/session/weak" className="w-full">חזרה על חניכים קשים</Button>
            <Button href="/train" variant="secondary" className="w-full">תרגול נוסף</Button>
            <Button href="/dashboard" variant="ghost" className="w-full">חזרה ללוח הבקרה</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
