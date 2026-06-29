import Link from "next/link";
import { BarChart3, BookOpen, Dumbbell, Home, Settings, Shield, Trophy, Users } from "lucide-react";
import { currentUser } from "@/lib/demo-data";
import { Button } from "@/components/ui";

const nav = [
  { href: "/dashboard", label: "המצב שלי", icon: Home },
  { href: "/train", label: "תרגול שמות", icon: Dumbbell },
  { href: "/leaderboard", label: "התקדמות מפקדים", icon: Trophy },
  { href: "/competitions", label: "תרגול משותף", icon: Users },
  { href: "/library", label: "מאגר חניכים", icon: BookOpen },
  { href: "/admin", label: "ניהול המאגר", icon: Shield },
  { href: "/settings", label: "הגדרות", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = currentUser();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#0f766e33,transparent_34%),#050506]">
      <aside className="fixed inset-y-0 right-0 z-20 hidden w-64 border-l border-white/10 bg-black/40 p-4 backdrop-blur lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <img src="/logo.png" alt="Sigit Faces" className="h-12 w-12 rounded-lg border border-white/10 object-cover" />
          <div>
            <p className="font-semibold text-white">Sigit Faces</p>
            <p className="text-xs text-zinc-500">קורס סיגיט</p>
          </div>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="" className="h-10 w-10 rounded-md" />
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-zinc-500">מפקד/ת בקורס</p>
            </div>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-md object-cover" />
            Sigit Faces
          </Link>
          <Button href="/train" className="h-9 px-3">תרגול</Button>
        </div>
      </header>
      <main className="px-4 py-8 lg:mr-64 lg:px-8">{children}</main>
    </div>
  );
}

export function MiniChartIcon() {
  return <BarChart3 className="h-4 w-4" />;
}
