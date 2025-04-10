import { ReactNode } from "react";

// Profession Categories
export const professionCategories = [
  {
    id: "plumber",
    label: "Plumber",
    value: "Plumber",
    icon: "M12 22v-5 M9 8h6 M12 2v3 M4.636 18.364C10.5 12.5 12 2 12 2s1.5 10.5 7.364 16.364",
    bgColor: "bg-primary-50",
    iconColor: "text-primary-500"
  },
  {
    id: "electrician",
    label: "Electrician",
    value: "Electrician",
    icon: "M22 12h-5 M2 12h5 M12 2v5 M12 22v-5 M12 17a5 5 0 0 0 0-10",
    bgColor: "bg-secondary-50",
    iconColor: "text-secondary-500"
  },
  {
    id: "painter",
    label: "Painter",
    value: "Painter",
    icon: "M19 9l-5 5V9l5-5v5 M19 14h-4 M12.828 12.828a3 3 0 1 0-4.243-4.243 3 3 0 0 0 4.243 4.243z M5 21l8-8 M16 3h2a2 2 0 0 1 2 2v2",
    bgColor: "bg-accent-50",
    iconColor: "text-accent-500"
  },
  {
    id: "carpenter",
    label: "Carpenter",
    value: "Carpenter",
    icon: "M3 11h18 M12 3v8 M19 5V3H5v2 M12 16v4 M8 16h8",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600"
  },
  {
    id: "mason",
    label: "Mason",
    value: "Mason",
    icon: "M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600"
  },
  {
    id: "cleaner",
    label: "Cleaner",
    value: "Cleaner",
    icon: "M3 3v18h18 M19 9V3H9l-6 6 M18 22l-3-3-3 3-3-3-3 3V11l3-3 3 3 3-3 3 3Z",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: "ac-technician",
    label: "AC Technician",
    value: "AC Technician",
    icon: "M9.5 7.5a4.5 4.5 0 0 0 6.5 6.5 M4 7h3a1 1 0 0 0 1-1V5a2 2 0 0 0-4 0v2Z M21 10h-3a1 1 0 0 0-1 1v1a2 2 0 0 0 4 0v-2Z M14.7 14.7a4.5 4.5 0 0 0-6.4-6.4 M17 7h2a2 2 0 0 0 0-4h-2 M7 17H5a2 2 0 0 0 0 4h2",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: "roofer",
    label: "Roofer",
    value: "Roofer",
    icon: "M2 20l2-7H7a3 3 0 0 0 3-3v0a4 4 0 0 1 4-4h3a3 3 0 0 0 0-6 3 3 0 0 0-3 3v1h-1a2 2 0 0 0-2 2v0c0 1.1.9 2 2 2a2 2 0 0 0 2-2 M22 20h-7a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H8",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  },
  {
    id: "tiler",
    label: "Tiler",
    value: "Tiler",
    icon: "M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  }
];

// Market Categories
export const marketCategories = [
  { id: "hardware", label: "Hardware" },
  { id: "paint", label: "Paint" },
  { id: "electrical", label: "Electrical" },
  { id: "tools", label: "Tools" },
  { id: "plumbing", label: "Plumbing" }
];

// User Roles
export const userRoles = [
  { id: "worker", label: "Worker" },
  { id: "employer", label: "Employer" }
];

// Job Status Options
export const jobStatusOptions = [
  { id: "open", label: "Open" },
  { id: "assigned", label: "Assigned" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" }
];
