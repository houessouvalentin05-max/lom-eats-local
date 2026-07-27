import type { ReactNode } from "react";

export function ChalkTag({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "div";
}) {
  return <Tag className={`chalk-tag ${className}`}>{children}</Tag>;
}