"use client";

import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Timer, X } from "lucide-react";
import { closeNameMatch, scoreAnswer } from "@/lib/utils";
import { Button, Card, EmptyState, ProgressBar } from "@/components/ui";

type TrainingStudent = {
  id: string;
  displayName: string;
  imageUrl: string;
  cycleId?: string;
};

type Answer = { correct: boolean; score: number; ms: number; personId: string };

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function TrainingSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLevel = clamp(Number(searchParams.get("level") ?? 3), 1, 5);
  const requestedRounds = clamp(Number(searchParams.get("rounds") ?? 10), 3, 50);
  const cycleId = searchParams.get("cycleId") ?? "";
  const startedAt = useRef(0);
  const [students, setStudents] = useState<TrainingStudent[]>([]);
  const [deck, setDeck] = useState<TrainingStudent[]>([]);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState<null | { correct: boolean; label: string; score: number }>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const person = deck[index];

  const options = useMemo(() => {
    if (!person) return [];
    const distractors = shuffle(students.filter((student) => student.id !== person.id));
    const count = requestedLevel <= 1 ? 2 : requestedLevel >= 3 ? 6 : 4;
    return shuffle([person, ...distractors].slice(0, count));
  }, [person, students, requestedLevel]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const cycleQuery = cycleId ? `?cycleId=${encodeURIComponent(cycleId)}` : "";
        const response = await fetch(`/api/training/students${cycleQuery}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "טעינת החניכים נכשלה");
        }

        const loadedStudents = data.students as TrainingStudent[];
        setStudents(loadedStudents);
        setDeck(shuffle(loadedStudents).slice(0, Math.min(requestedRounds, loadedStudents.length)));
        startedAt.current = performance.now();
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "טעינת החניכים נכשלה");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, [cycleId, requestedRounds]);

  function answer(value: string, eventTime: number) {
    if (!person || feedback) return;
    const elapsed = Math.max(250, Math.round(eventTime - startedAt.current));
    const correct = requestedLevel >= 5 ? closeNameMatch(person.displayName, value) : value === person.displayName;
    const score = scoreAnswer(correct, elapsed, answers.filter((item) => item.correct).length, requestedLevel);
    setAnswers((current) => [...current, { correct, score, ms: elapsed, personId: person.id }]);
    setFeedback({ correct, score, label: person.displayName });
  }

  function next() {
    setTyped("");
    setFeedback(null);
    startedAt.current = performance.now();

    if (index + 1 >= deck.length) {
      const payload = encodeURIComponent(JSON.stringify(answers));
      router.push(`/results/play?answers=${payload}`);
      return;
    }

    setIndex((current) => current + 1);
  }

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-4xl">
        <p className="text-zinc-400">טוען תרגול...</p>
      </Card>
    );
  }

  if (error) {
    return <EmptyState title="לא ניתן להתחיל תרגול" body={error} action={<Button href="/train">חזרה לבחירת רמה</Button>} />;
  }

  if (deck.length < 2 || !person) {
    return (
      <EmptyState
        title="אין מספיק חניכים לתרגול"
        body="העלו לפחות שתי תמונות חניכים למאגר כדי להתחיל לתרגל שמות ופנים."
        action={<Button href="/library">מעבר למאגר חניכים</Button>}
      />
    );
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">שאלה {index + 1} מתוך {deck.length}</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">רמת קושי {requestedLevel}{cycleId ? ` · ${cycleId}` : ""}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-zinc-300"><Timer className="h-4 w-4" /> תרגול פעיל</div>
      </div>
      <ProgressBar value={(index / deck.length) * 100} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          {requestedLevel === 4 ? (
            <div className="flex aspect-square items-center justify-center rounded-md bg-white/[0.04] p-8 text-center text-4xl font-semibold text-white">{person.displayName}</div>
          ) : (
            <img src={person.imageUrl} alt="" className="aspect-square w-full rounded-md object-cover" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">
            {requestedLevel >= 5 ? "הקלידו את שם החניך" : requestedLevel === 4 ? "בחרו את תמונת החניך" : "בחרו את שם החניך"}
          </p>

          {requestedLevel >= 5 ? (
            <div className="mt-5 flex gap-2">
              <input value={typed} onChange={(event) => setTyped(event.target.value)} className="h-12 flex-1 rounded-md border border-white/10 bg-black/40 px-3 outline-none focus:border-teal-300" placeholder="שם מלא" />
              <button onClick={(event: MouseEvent<HTMLButtonElement>) => answer(typed, event.timeStamp)} className="rounded-md bg-teal-400 px-4 font-semibold text-zinc-950">שליחה</button>
            </div>
          ) : requestedLevel === 4 ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {options.slice(0, 6).map((option) => (
                <button key={option.id} onClick={(event) => answer(option.displayName, event.timeStamp)} className="rounded-md border border-white/10 bg-white/[0.04] p-2 hover:border-teal-300">
                  <img src={option.imageUrl} alt={option.displayName} className="aspect-square rounded object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <button key={option.id} onClick={(event) => answer(option.displayName, event.timeStamp)} className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-right font-semibold text-white hover:border-teal-300">
                  {option.displayName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {feedback ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={feedback.correct ? "font-semibold text-teal-300" : "font-semibold text-rose-300"}>
              {feedback.correct ? <Check className="mr-2 inline h-4 w-4" /> : <X className="mr-2 inline h-4 w-4" />}
              {feedback.correct ? "נכון" : `התשובה הנכונה: ${feedback.label}`}
            </p>
            <p className="text-sm text-zinc-400">+{feedback.score} נקודות</p>
            <button onClick={next} className="h-10 rounded-md bg-white px-4 text-sm font-semibold text-zinc-950">הבא</button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
