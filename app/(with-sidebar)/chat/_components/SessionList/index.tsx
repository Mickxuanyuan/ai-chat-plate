"use client";

import { memo } from "react";

import { cn } from "@/utils/tools";

import Header from "./Header";
import SessionList from "./List";

export const Sessions = memo(() => {
  return (
    <div className={cn("flex h-full w-full flex-col bg-background")}>
      <Header />
      <SessionList />
    </div>
  );
});

Sessions.displayName = "Sessions";
