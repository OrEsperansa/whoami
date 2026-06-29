"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldCheck } from "lucide-react";
import { useSessionStore } from "@/lib/session-store";
import { Button, Card, EmptyState } from "@/components/ui";

type Commander = {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  streak: number;
};

export function LoginClient() {
  const router = useRouter();
  const setUserId = useSessionStore((state) => state.setUserId);
  const [name, setName] = useState("");
  const [commanders, setCommanders] = useState<Commander[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommanders() {
      try {
        const response = await fetch("/api/commanders");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "טעינת המפקדים נכשלה");
        }

        setCommanders(data.commanders);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "טעינת המפקדים נכשלה");
      } finally {
        setIsLoading(false);
      }
    }

    loadCommanders();
  }, []);

  function choose(userId: string) {
    setUserId(userId);
    router.push("/dashboard");
  }

  async function createCommander() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("הזינו שם מפקד/ת");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/commanders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "יצירת המפקד/ת נכשלה");
      }

      setCommanders((current) => [...current, data.commander]);
      setName("");
      choose(data.commander.id);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "יצירת המפקד/ת נכשלה");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#134e4a55,transparent_36%),#050506] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <img src="/logo.png" alt="Sigit Faces" className="h-20 w-20 rounded-lg border border-white/10 object-cover shadow-2xl shadow-teal-950/40" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">Sigit Faces</p>
            </div>
            <h1 className="text-4xl font-semibold text-white sm:text-6xl">בחרו מפקד/ת</h1>
            <p className="mt-4 max-w-2xl text-zinc-400">מערכת פשוטה למדריכי קורס סיגיט: מעלים תמונות של חניכים, מזינים שם, ומתאמנים עד שהשם והפנים יושבים בראש. אין זיהוי פנים ואין הזדהות מסובכת.</p>
          </div>
          <Button href="/library" variant="secondary"><ShieldCheck className="h-4 w-4" /> ניהול מאגר חניכים</Button>
        </div>

        {isLoading ? (
          <Card className="min-h-40 animate-pulse">
            <p className="text-zinc-400">טוען מפקדים...</p>
          </Card>
        ) : commanders.length === 0 ? (
          <EmptyState title="עוד אין מפקדים במערכת" body="צרו מפקד/ת ראשון/ה למטה. אחרי זה אפשר להיכנס בלחיצה אחת ולהתחיל לבנות את מאגר החניכים." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {commanders.map((user) => (
              <Card key={user.id} className="group">
                <button onClick={() => choose(user.id)} className="w-full text-right">
                  <div className="flex items-center justify-between">
                    <img src={user.avatar ?? "/logo.png"} alt="" className="h-16 w-16 rounded-lg ring-1 ring-white/10" />
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-zinc-300">מפקד/ת</span>
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-white">{user.name}</h2>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <span className="rounded-md bg-white/5 p-2 text-zinc-400"><b className="block text-white">{user.xp}</b>נקודות</span>
                    <span className="rounded-md bg-white/5 p-2 text-zinc-400"><b className="block text-white">{user.streak}</b>ימי תרגול</span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-300">
                    כניסה כמפקד/ת
                  </div>
                </button>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-semibold text-white">הוספת מפקד/ת לרשימה</p>
              <p className="mt-1 text-sm text-zinc-400">לשימוש פנימי ומהיר. אין צורך בסיסמה - פשוט בוחרים שם ומתחילים לתרגל.</p>
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-4 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm outline-none focus:border-teal-300 md:max-w-sm" placeholder="שם המפקד/ת" />
              {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
            </div>
            <button onClick={createCommander} disabled={isCreating} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {isCreating ? "מוסיף..." : "הוספה וכניסה"}
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
