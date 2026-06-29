import { avatarUrl } from "@/lib/utils";

export type Role = "participant" | "admin";

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  rank: number;
  xp: number;
  streak: number;
  accuracy: number;
  avgMs: number;
  mastered: number;
  weeklyScore: number;
  monthlyScore: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  mastery: number;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl: string;
  notes: string;
  tags: string[];
  categoryId: string;
  masteredBy: number;
  familiarity: number;
  mistakes: number;
};

export type TrainingSet = {
  id: string;
  name: string;
  description: string;
  categoryIds: string[];
  personIds: string[];
  difficultyRange: [number, number];
  isActive: boolean;
};

export type Attempt = {
  id: string;
  userId: string;
  personId: string;
  mode: string;
  difficultyLevel: number;
  wasCorrect: boolean;
  responseTimeMs: number;
  score: number;
  createdAt: string;
};

export type Competition = {
  id: string;
  title: string;
  trainingSetId: string;
  mode: string;
  durationSeconds: number;
  questionCount: number;
  levelRange: [number, number];
  results: { userId: string; score: number; accuracy: number; averageResponseTimeMs: number }[];
};

export const users: User[] = [
  { id: "u1", name: "מפקד תימור", avatar: avatarUrl("מפקד תימור", "0f766e"), role: "participant", rank: 1, xp: 18420, streak: 16, accuracy: 93, avgMs: 1780, mastered: 42, weeklyScore: 3620, monthlyScore: 12880 },
  { id: "u2", name: "מפקדת נועה", avatar: avatarUrl("מפקדת נועה", "1d4ed8"), role: "participant", rank: 2, xp: 17110, streak: 11, accuracy: 89, avgMs: 1930, mastered: 38, weeklyScore: 3100, monthlyScore: 11920 },
  { id: "u3", name: "מפקד אורי", avatar: avatarUrl("מפקד אורי", "7c3aed"), role: "participant", rank: 3, xp: 15680, streak: 8, accuracy: 86, avgMs: 2110, mastered: 35, weeklyScore: 2840, monthlyScore: 10560 },
  { id: "u4", name: "מפקדת שירה", avatar: avatarUrl("מפקדת שירה", "be123c"), role: "participant", rank: 4, xp: 14240, streak: 5, accuracy: 84, avgMs: 2250, mastered: 31, weeklyScore: 2310, monthlyScore: 9320 },
  { id: "admin", name: "אחראי מאגר", avatar: avatarUrl("אחראי מאגר", "18181b"), role: "admin", rank: 0, xp: 0, streak: 0, accuracy: 0, avgMs: 0, mastered: 0, weeklyScore: 0, monthlyScore: 0 },
];

export const categories: Category[] = [
  { id: "team", name: "מחלקה א׳", description: "חניכי מחלקה א׳ בקורס סיגיט.", color: "#14b8a6", icon: "Users", mastery: 78 },
  { id: "client", name: "מחלקה ב׳", description: "חניכי מחלקה ב׳ בקורס סיגיט.", color: "#38bdf8", icon: "Briefcase", mastery: 64 },
  { id: "event", name: "מחלקה ג׳", description: "חניכי מחלקה ג׳ וחניכים שצריך לחזק.", color: "#f97316", icon: "Calendar", mastery: 52 },
  { id: "family", name: "סגל וחונכים", description: "אנשי סגל, חונכים ומלווים בקורס.", color: "#f43f5e", icon: "Heart", mastery: 84 },
];

const names = [
  ["דניאל", "לוי", "team", ["מחלקה א", "סייבר"], 9, 92, 1],
  ["יובל", "כהן", "client", ["מחלקה ב", "חדש"], 7, 71, 5],
  ["עמית", "פרץ", "team", ["מחלקה א", "חזק"], 8, 86, 2],
  ["רוני", "אברהם", "event", ["מחלקה ג", "לחיזוק"], 5, 54, 8],
  ["נועה", "בן דוד", "client", ["מחלקה ב", "פרויקט"], 6, 62, 6],
  ["איתי", "מזרחי", "family", ["סגל"], 10, 96, 0],
  ["מאיה", "שפירא", "event", ["מחלקה ג", "לחיזוק"], 4, 48, 9],
  ["עומר", "ברק", "team", ["מחלקה א", "מעבדה"], 8, 81, 3],
  ["ליה", "רוזן", "client", ["מחלקה ב", "תרגיל"], 6, 69, 4],
  ["אורי", "גולן", "event", ["מחלקה ג", "חדש"], 3, 42, 10],
  ["שחר", "קפלן", "family", ["חונך"], 9, 91, 1],
  ["גיא", "אלון", "team", ["מחלקה א", "תרגיל"], 7, 75, 5],
  ["תמר", "מור", "client", ["מחלקה ב", "לחיזוק"], 5, 58, 8],
  ["אלון", "ניר", "event", ["מחלקה ג", "פרויקט"], 4, 46, 11],
  ["יעל", "אדרי", "team", ["מחלקה א", "חדש"], 9, 89, 2],
] as const;

export const people: Person[] = names.map(([firstName, lastName, categoryId, tags, masteredBy, familiarity, mistakes], index) => {
  const displayName = `${firstName} ${lastName}`;
  return {
    id: `p${index + 1}`,
    firstName,
    lastName,
    displayName,
    imageUrl: avatarUrl(displayName, ["0f766e", "1d4ed8", "be123c", "7c3aed", "b45309"][index % 5]),
    notes: `${displayName} הוא חניך דוגמה בקורס סיגיט לתרגול זיכרון שמות ופנים.`,
    tags: [...tags],
    categoryId,
    masteredBy,
    familiarity,
    mistakes,
  };
});

export const trainingSets: TrainingSet[] = [
  { id: "set-all", name: "כל חניכי הקורס", description: "תרגול מאוזן על כל מאגר החניכים.", categoryIds: categories.map((c) => c.id), personIds: people.map((p) => p.id), difficultyRange: [1, 8], isActive: true },
  { id: "set-team", name: "מחלקה א׳", description: "זיהוי מהיר של חניכי מחלקה א׳.", categoryIds: ["team"], personIds: people.filter((p) => p.categoryId === "team").map((p) => p.id), difficultyRange: [2, 7], isActive: true },
  { id: "set-client", name: "מחלקה ב׳", description: "תרגול ממוקד לחניכי מחלקה ב׳.", categoryIds: ["client"], personIds: people.filter((p) => p.categoryId === "client").map((p) => p.id), difficultyRange: [2, 8], isActive: true },
  { id: "set-weak", name: "חניכים שצריך לזכור", description: "חזרה אדפטיבית על חניכים שפחות יושבים בראש.", categoryIds: categories.map((c) => c.id), personIds: people.filter((p) => p.familiarity < 65).map((p) => p.id), difficultyRange: [3, 8], isActive: true },
];

export const attempts: Attempt[] = Array.from({ length: 28 }, (_, index) => {
  const user = users[index % 4];
  const person = people[(index * 3) % people.length];
  const correct = index % 5 !== 0;
  return {
    id: `a${index + 1}`,
    userId: user.id,
    personId: person.id,
    mode: ["רב-ברירה", "זיהוי הפוך", "הקלדה", "מהירות"][index % 4],
    difficultyLevel: (index % 8) + 1,
    wasCorrect: correct,
    responseTimeMs: 1400 + (index % 7) * 310,
    score: correct ? 115 + index * 9 : 8,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  };
});

export const competitions: Competition[] = [
  {
    id: "c1",
    title: "תרגול פתיחת יום",
    trainingSetId: "set-all",
    mode: "speed-round",
    durationSeconds: 180,
    questionCount: 24,
    levelRange: [3, 7],
    results: [
      { userId: "u1", score: 3210, accuracy: 94, averageResponseTimeMs: 1660 },
      { userId: "u2", score: 2920, accuracy: 90, averageResponseTimeMs: 1810 },
      { userId: "u3", score: 2610, accuracy: 86, averageResponseTimeMs: 1960 },
    ],
  },
  {
    id: "c2",
    title: "בדיקת שמות מחלקה ב׳",
    trainingSetId: "set-client",
    mode: "mastery-exam",
    durationSeconds: 420,
    questionCount: 30,
    levelRange: [5, 8],
    results: [
      { userId: "u2", score: 4120, accuracy: 92, averageResponseTimeMs: 2140 },
      { userId: "u1", score: 3980, accuracy: 90, averageResponseTimeMs: 2050 },
    ],
  },
];

export const trend = [
  { day: "ב׳", accuracy: 81, speed: 2.7, sessions: 2 },
  { day: "ג׳", accuracy: 84, speed: 2.5, sessions: 3 },
  { day: "ד׳", accuracy: 83, speed: 2.4, sessions: 2 },
  { day: "ה׳", accuracy: 88, speed: 2.2, sessions: 4 },
  { day: "ו׳", accuracy: 91, speed: 2.0, sessions: 5 },
  { day: "ש׳", accuracy: 89, speed: 1.9, sessions: 2 },
  { day: "א׳", accuracy: 93, speed: 1.8, sessions: 3 },
];

export const levels = [
  "היכרות ראשונית",
  "זיהוי מתוך שתי אפשרויות",
  "זיהוי רב-ברירה",
  "זיהוי הפוך",
  "שליפה בהקלדה",
  "שליפה בלחץ זמן",
  "סבב מהירות",
  "מבחן שליטה",
];

export function currentUser() {
  return users[0];
}

export function categoryName(id: string) {
  return categories.find((category) => category.id === id)?.name ?? "ללא מחלקה";
}

export function personById(id: string) {
  return people.find((person) => person.id === id);
}
