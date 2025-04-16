"use client";

import React from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-100">
      {children}
    </div>
  );
}
