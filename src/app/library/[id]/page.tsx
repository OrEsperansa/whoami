import { AppShell } from "@/components/app-shell";
import { Button, Card, PageHeader } from "@/components/ui";
import { categories, people } from "@/lib/demo-data";

export default async function LibraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = people.find((item) => item.id === id) ?? people[0];
  return (
    <AppShell>
      <PageHeader kicker="עריכת חניך/ה" title={person.displayName} />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card><img src={person.imageUrl} alt="" className="aspect-square w-full rounded-md" /><Button variant="secondary" className="mt-4 w-full">העלאת תמונת חניך/ה</Button></Card>
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-zinc-300">שם פרטי<input defaultValue={person.firstName} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" /></label>
            <label className="text-sm text-zinc-300">שם משפחה<input defaultValue={person.lastName} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" /></label>
            <label className="text-sm text-zinc-300">שם להצגה<input defaultValue={person.displayName} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" /></label>
            <label className="text-sm text-zinc-300">מחלקה<select defaultValue={person.categoryId} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="text-sm text-zinc-300 md:col-span-2">תגיות<input defaultValue={person.tags.join(", ")} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-black/40 px-3" /></label>
            <label className="text-sm text-zinc-300 md:col-span-2">הערות<textarea defaultValue={person.notes} className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-black/40 p-3" /></label>
          </div>
          <div className="mt-6 flex gap-2"><Button>שמירת שינויים</Button><Button href="/library" variant="secondary">חזרה לספרייה</Button></div>
        </Card>
      </div>
    </AppShell>
  );
}
