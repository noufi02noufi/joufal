import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price from cents/paisa to rupee representation
export function formatPrice(price: number): string {
  if (!price) return "0";
  return (price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date for display
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Not specified";
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }
  
  return dateObj.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Convert workerProfile.availability to a more readable format
export function formatAvailability(availability: string): string {
  if (!availability) return "Unknown";
  
  return availability.charAt(0).toUpperCase() + availability.slice(1);
}

// Get profession icon path
export function getProfessionIcon(profession: string): string {
  switch (profession.toLowerCase()) {
    case "plumber":
      return "M12 22v-5 M9 8h6 M12 2v3 M4.636 18.364C10.5 12.5 12 2 12 2s1.5 10.5 7.364 16.364";
    case "electrician":
      return "M22 12h-5 M2 12h5 M12 2v5 M12 22v-5 M12 17a5 5 0 0 0 0-10";
    default:
      return "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z";
  }
}
