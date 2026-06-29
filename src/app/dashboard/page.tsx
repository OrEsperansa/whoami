import { ArrowRight, Brain, Clock, Flame, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AccuracyChart, SpeedChart } from "@/components/charts";
import { Button, Card, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { attempts, categories, currentUser, people } from "@/lib/demo-data";
import { ms } from "@/lib/utils";

export default function DashboardPage() {
  const user = currentUser();
  const weak = [...people].sort((a, b) => b.mistakes - a.mistakes).slice(0, 5);
  const recent = attempts.filter((attempt) => attempt.userId === user.id).slice(0, 6);

  return (
    <AppShell>
      <PageHeader
        kicker="לוח מפקד/ת"
        title={`טוב שחזרת, ${user.name.split(" ")[0]}`}
        action={<Button href="/train"><Brain className="h-4 w-4" /> תרגול שמות ופנים</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="חניכים שאני זוכר/ת" value={user.mastered} detail="מתוך מאגר הקורס" />
        <Stat label="נקודות תרגול" value={user.xp.toLocaleString()} detail="+620 השבוע" />
        <Stat label="רצף תרגול" value={user.streak} detail="ימים עם תרגול" />
        <Stat label="דיוק כולל" value={`${user.accuracy}%`} detail={`${ms(user.avgMs)} זמן תגובה ממוצע`} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <Target className="h-5 w-5 text-teal-300" />
          <p className="mt-4 text-3xl font-semibold text-white">{user.mastered}</p>
          <p className="text-sm text-zinc-400">חניכים בשליטה</p>
        </Card>
        <Card>
          <Clock className="h-5 w-5 text-sky-300" />
          <p className="mt-4 text-3xl font-semibold text-white">12</p>
          <p className="text-sm text-zinc-400">חניכים לחזרה היום</p>
        </Card>
        <Card>
          <Flame className="h-5 w-5 text-orange-300" />
          <p className="mt-4 text-3xl font-semibold text-white">37</p>
          <p className="text-sm text-zinc-400">אימונים שהושלמו</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">שליטה לפי מחלקה</h2>
          <div className="mt-5 space-y-4">
            {categories.map((category) => (
              <div key={category.id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-300">{category.name}</span>
                  <span className="text-zinc-500">{category.mastery}%</span>
                </div>
                <ProgressBar value={category.mastery} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">חניכים שצריך לחזק</h2>
          <div className="mt-5 space-y-3">
            {weak.map((person) => (
              <div key={person.id} className="flex items-center gap-3 rounded-md bg-white/[0.04] p-2">
                <img src={person.imageUrl} alt="" className="h-11 w-11 rounded-md" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{person.displayName}</p>
                  <p className="text-xs text-zinc-500">{person.mistakes} טעויות אחרונות בשם</p>
                </div>
                <Button href="/train" variant="ghost" className="h-9 px-2"><ArrowRight className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">מגמת דיוק</h2>
          <AccuracyChart />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">מגמת מהירות</h2>
          <SpeedChart />
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold text-white">היסטוריית אימונים אחרונה</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-right text-sm">
            <thead className="text-zinc-500">
              <tr><th className="py-2">מצב</th><th>רמה</th><th>תוצאה</th><th>מהירות</th><th>ניקוד</th></tr>
            </thead>
            <tbody>
              {recent.map((attempt) => (
                <tr key={attempt.id} className="border-t border-white/10">
                  <td className="py-3 text-white">{attempt.mode}</td>
                  <td>{attempt.difficultyLevel}</td>
                  <td className={attempt.wasCorrect ? "text-teal-300" : "text-rose-300"}>{attempt.wasCorrect ? "נכון" : "טעות"}</td>
                  <td>{ms(attempt.responseTimeMs)}</td>
                  <td><Trophy className="mr-1 inline h-4 w-4 text-orange-300" />{attempt.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
