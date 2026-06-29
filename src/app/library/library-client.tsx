"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Trash2, Upload } from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/ui";

type Student = {
  id: string;
  displayName: string;
  imageUrl: string;
  notes: string | null;
  tags: unknown;
  createdAt: string;
};

function nameFromFile(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function LibraryClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return students;
    return students.filter((student) => student.displayName.toLowerCase().includes(normalizedQuery));
  }, [query, students]);

  useEffect(() => {
    async function loadStudents() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/students");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "טעינת החניכים נכשלה");
        }

        setStudents(data.students);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "טעינת החניכים נכשלה");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  function onFilesSelected(files: FileList | null) {
    setMessage("");
    setError("");
    setSelectedFiles(Array.from(files ?? []).filter((file) => file.type.startsWith("image/")));
  }

  async function uploadStudents() {
    if (selectedFiles.length === 0) {
      setError("בחרו תמונות להעלאה");
      return;
    }

    setIsUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const response = await fetch("/api/students", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "העלאת החניכים נכשלה");
      }

      setStudents((current) => [...data.students, ...current]);
      setSelectedFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setMessage(`${data.students.length} חניכים נשמרו במאגר`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "העלאת החניכים נכשלה");
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteAllStudents() {
    if (students.length === 0) return;
    const confirmed = window.confirm("למחוק את כל החניכים והתמונות שלהם מהמאגר?");
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/students", { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "מחיקת החניכים נכשלה");
      }

      setStudents([]);
      setMessage(`${data.deleted} חניכים נמחקו מהמאגר`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "מחיקת החניכים נכשלה");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        kicker="מאגר חניכים"
        title="ייבוא תמונות לפי שם הקובץ"
        action={
          <button
            onClick={deleteAllStudents}
            disabled={students.length === 0 || isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "מוחק..." : "מחיקת כל החניכים"}
          </button>
        }
      />

      <Card className="mb-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-semibold text-white">העלאת חניכים</p>
            <p className="mt-1 text-sm text-zinc-400">
              בחרו תמונות. שם הקובץ יהפוך לשם החניך: למשל <span className="text-zinc-200">יובל כהן.jpg</span>.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => onFilesSelected(event.target.files)}
              className="hidden"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Upload className="h-4 w-4" />
                בחירת תמונות
              </button>
              <span className="text-sm text-zinc-400">
                {selectedFiles.length > 0 ? `נבחרו ${selectedFiles.length} תמונות` : "עדיין לא נבחרו תמונות"}
              </span>
            </div>
          </div>
          <button
            onClick={uploadStudents}
            disabled={selectedFiles.length === 0 || isUploading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "מעלה..." : "שמירת התמונות במאגר"}
          </button>
        </div>

        {selectedFiles.length > 0 ? (
          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-3">
            <p className="mb-3 text-sm font-semibold text-white">חניכים שיווצרו מהקבצים</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <span key={`${file.name}-${file.size}`} className="rounded-md bg-white/10 px-3 py-1 text-sm text-zinc-300">
                  {nameFromFile(file.name)}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {message ? <p className="mt-4 text-sm text-teal-300">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </Card>

      <Card className="mb-4">
        <label className="relative block">
          <Search className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-black/40 pl-3 pr-9"
            placeholder="חיפוש חניכים במאגר"
          />
        </label>
      </Card>

      {isLoading ? (
        <Card className="min-h-40 animate-pulse">
          <p className="text-zinc-400">טוען חניכים...</p>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title={students.length === 0 ? "אין חניכים במאגר" : "לא נמצאו חניכים"}
          body={students.length === 0 ? "העלו תמונות כדי ליצור חניכים. שם כל חניך יילקח משם קובץ התמונה." : "נסו לחפש שם אחר."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <div className="flex gap-4">
                <img src={student.imageUrl} alt="" className="h-24 w-24 rounded-md object-cover" />
                <div className="min-w-0">
                  <h2 className="font-semibold text-white">{student.displayName}</h2>
                  <p className="mt-1 text-sm text-zinc-400">נשמר בבסיס הנתונים</p>
                </div>
              </div>
              {student.notes ? <p className="mt-4 text-sm text-zinc-400">{student.notes}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
