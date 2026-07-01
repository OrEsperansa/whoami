"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Gauge, Images, Keyboard, ListChecks } from "lucide-react";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";

const difficulties = [
  { level: 1, title: "קל", body: "בחירה מתוך שתי תשובות. מתאים להתחלה מהירה." },
  { level: 3, title: "רגיל", body: "בחירה מתוך כמה שמות. זה התרגול המומלץ." },
  { level: 4, title: "הפוך", body: "מופיע שם ובוחרים את תמונת החניך." },
  { level: 5, title: "קשה", body: "רואים תמונה ומקלידים את שם החניך." },
];

type TrainingStudent = {
  id: string;
  displayName: string;
  imageUrl: string;
  cycleId?: string;
};

type CycleOption = {
  id: string;
  studentCount: number;
};

export function TrainClient() {
  const router = useRouter();
  const [students, setStudents] = useState<TrainingStudent[]>([]);
  const [cycles, setCycles] = useState<CycleOption[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [level, setLevel] = useState(3);
  const [rounds, setRounds] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/training/students");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "טעינת החניכים נכשלה");
        }

        setStudents(data.students);
        setCycles(data.cycles ?? []);
        setCycleId(data.selectedCycleId ?? data.latestCycleId ?? "");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "טעינת החניכים נכשלה");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  async function changeCycle(nextCycleId: string) {
    setCycleId(nextCycleId);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/training/students?cycleId=${encodeURIComponent(nextCycleId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "טעינת החניכים נכשלה");
      }

      setStudents(data.students);
      setCycles(data.cycles ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "טעינת החניכים נכשלה");
    } finally {
      setIsLoading(false);
    }
  }

  function start() {
    const cycleQuery = cycleId ? `&cycleId=${encodeURIComponent(cycleId)}` : "";
    router.push(`/train/session/play?level=${level}&rounds=${rounds}${cycleQuery}`);
  }

  return (
    <>
      <PageHeader kicker="תרגול שמות ופנים" title="בחרו רמת קושי והתחילו לשחק" />

      {isLoading ? (
        <Card className="min-h-40 animate-pulse">
          <p className="text-zinc-400">טוען את מאגר החניכים...</p>
        </Card>
      ) : error ? (
        <EmptyState title="לא ניתן להתחיל תרגול" body={error} />
      ) : students.length < 2 ? (
        <EmptyState
          title="צריך לפחות שני חניכים לתרגול"
          body="העלו תמונות ושמות במאגר החניכים. אחר כך תוכלו להתחיל לתרגל מיד."
          action={<Button href="/library">מעבר למאגר חניכים</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <Images className="h-5 w-5 text-teal-300" />
              <p className="font-semibold text-white">{students.length} חניכים זמינים לתרגול</p>
            </div>

            {cycles.length > 0 ? (
              <label className="mb-5 block max-w-xs">
                <span className="text-sm font-medium text-zinc-300">מחזור</span>
                <select
                  value={cycleId}
                  onChange={(event) => changeCycle(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3"
                >
                  {cycles.map((cycle) => (
                    <option key={cycle.id} value={cycle.id}>
                      {cycle.id} ({cycle.studentCount})
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.level}
                  onClick={() => setLevel(difficulty.level)}
                  className={`rounded-lg border p-4 text-right transition ${
                    level === difficulty.level ? "border-teal-300 bg-teal-300/10" : "border-white/10 bg-white/[0.04] hover:border-white/30"
                  }`}
                >
                  <p className="text-lg font-semibold text-white">{difficulty.title}</p>
                  <p className="mt-2 text-sm text-zinc-400">{difficulty.body}</p>
                </button>
              ))}
            </div>

            <label className="mt-6 block max-w-xs">
              <span className="text-sm font-medium text-zinc-300">מספר שאלות</span>
              <input
                type="number"
                min={3}
                max={50}
                value={rounds}
                onChange={(event) => setRounds(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3"
              />
            </label>

            <button
              onClick={start}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-400 px-6 text-base font-semibold text-zinc-950 transition hover:bg-teal-300"
            >
              <Dumbbell className="h-5 w-5" />
              התחלת תרגול
            </button>
          </Card>

          <div className="space-y-4">
            <Card>
              <ListChecks className="h-5 w-5 text-teal-300" />
              <p className="mt-3 text-lg font-semibold text-white">המטרה פשוטה</p>
              <p className="mt-1 text-sm text-zinc-400">לראות פנים, לזכור שם, ולחזור על מי שמתבלבלים בו.</p>
            </Card>
            <Card>
              <Keyboard className="h-5 w-5 text-sky-300" />
              <p className="mt-3 text-lg font-semibold text-white">רמה קשה</p>
              <p className="mt-1 text-sm text-zinc-400">ברמה קשה מקלידים את השם במקום לבחור תשובה.</p>
            </Card>
            <Card>
              <Gauge className="h-5 w-5 text-orange-300" />
              <p className="mt-3 text-lg font-semibold text-white">מהיר וברור</p>
              <p className="mt-1 text-sm text-zinc-400">אין סטים מסובכים. בוחרים רמה ומתחילים.</p>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
