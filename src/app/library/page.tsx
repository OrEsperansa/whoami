import { AppShell } from "@/components/app-shell";
import { LibraryClient } from "@/app/library/library-client";

export default function LibraryPage() {
  return (
    <AppShell>
      <LibraryClient />
    </AppShell>
  );
}
