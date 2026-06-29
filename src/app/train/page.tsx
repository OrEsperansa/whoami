import { AppShell } from "@/components/app-shell";
import { TrainClient } from "@/app/train/train-client";

export default function TrainPage() {
  return (
    <AppShell>
      <TrainClient />
    </AppShell>
  );
}
