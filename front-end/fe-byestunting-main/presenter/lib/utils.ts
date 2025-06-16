import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// perubahan Ihsan: Menambahkan utility function untuk format tanggal dengan error handling
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return "Tanggal tidak valid"
  }
}

// perubahan Ihsan: Menambahkan utility function untuk format reading time
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 menit"
  return `${minutes} menit`
}

// perubahan Ihsan: Menambahkan utility function untuk truncate text dengan length control
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// perubahan Ihsan: Menambahkan utility function untuk generate slug yang konsisten
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
