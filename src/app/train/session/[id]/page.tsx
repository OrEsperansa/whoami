import { TrainingSession } from "@/app/train/session/[id]/training-session";
import { AppShell } from "@/components/app-shell";

export default function SessionPage() {
  return (
    <AppShell>
      <TrainingSession />
    </AppShell>
  );
}
