"use client";

import { usePathname } from "next/navigation";

// The address that failed to resolve, shown as data on the 404 sheet.
export function MissingPath({ className }: { className?: string }) {
  const pathname = usePathname();
  return <code className={className}>{pathname}</code>;
}
