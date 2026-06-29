"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  userId: string | null;
  setUserId: (userId: string) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId) => set({ userId }),
      clear: () => set({ userId: null }),
    }),
    { name: "sigit-faces-session" },
  ),
);
