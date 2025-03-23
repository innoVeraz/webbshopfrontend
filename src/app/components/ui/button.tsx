"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "link" | "info" | "success" | "warning" | "error" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  className, 
  ...props 
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "btn",
        `btn-success`,
        `btn-${size}`,
        loading && "loading",
        className
      )}
    >
      {children}
    </button>
  );
}
