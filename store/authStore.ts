"use client";

import { create } from "zustand";
import { AuthEmployee } from "@/types";

interface AuthState {
  user: AuthEmployee | null;
  setUser: (user: AuthEmployee | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
