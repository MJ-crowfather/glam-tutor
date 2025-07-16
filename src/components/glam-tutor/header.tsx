"use client";

import { Logo } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary tracking-wider">
            GlamTutor
          </h1>
        </div>
      </div>
    </header>
  );
}
