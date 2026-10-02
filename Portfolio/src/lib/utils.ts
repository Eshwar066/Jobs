import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function formatDuration(start: string | Date, end?: string | Date): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();

  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  }

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  if (months === 0) {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}