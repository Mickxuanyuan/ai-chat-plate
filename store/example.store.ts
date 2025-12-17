"use client";

import { create } from "zustand";
import type { Alignment } from "../model/example.interface";

type ExampleState = {
  alignment: Alignment;
  search: string;
  newName: string;
  setAlignment: (alignment: Alignment) => void;
  setSearch: (search: string) => void;
  setNewName: (newName: string) => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  alignment: "righteous",
  search: "",
  newName: "",
  setAlignment: (alignment) => set({ alignment }),
  setSearch: (search) => set({ search }),
  setNewName: (newName) => set({ newName }),
}));
