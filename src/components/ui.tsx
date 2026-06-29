import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20", className)}>{children}</div>;
}

export function Button({
  children,
  href,
  className,
  variant = "primary",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-300",
    variant === "primary" && "bg-teal-400 text-zinc-950 hover:bg-teal-300",
    variant === "secondary" && "border border-white/10 bg-white/10 text-white hover:bg-white/15",
    variant === "ghost" && "text-zinc-300 hover:bg-white/10 hover:text-white",
    variant === "danger" && "bg-rose-500 text-white hover:bg-rose-400",
    className,
  );
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}

export function Stat({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <Card className="min-h-28">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </Card>
  );
}

export function PageHeader({ title, kicker, action }: { title: string; kicker?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">{kicker}</p> : null}
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, color = "bg-teal-400" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-md text-sm text-zinc-400">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
